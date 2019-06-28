const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()
const jsonParser = express.json()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const word = await LanguageService.getWord(
        req.app.get('db'),
        req.language.id,
      )
      
      const result = {
        nextWord: word.original,
        totalScore: word.totalScore,
        wordCorrectCount: word.correctCount,
        wordIncorrectCount: word.incorrectCount
      }

      res.send(result)
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .post('/guess', jsonParser, async (req, res, next) => {
    const {guess} = req.body
    
    for (const field of ['guess'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id
      )

      const List = await LanguageService.createLL(
        words,
        req.language.head,
        req.language.total_score
      )
      
      let word = List.head.val
      let isCorrect = false

      if (guess.toLowerCase() !== List.head.val.translation) {
        List.head.val.memory_value = 1
        List.head.val.incorrect_count++
      } else {
        List.head.val.memory_value = List.head.val.memory_value * 2 
        List.head.val.correct_count++
        List.totalScore++
        isCorrect = true;
      }

      List.moveHead(List.head.val.memory_value)

      await LanguageService.saveUpdates(
        req.app.get('db'),
        List,
        req.language.id
      )

      const feedback = {
        'answer': word.translation,
        'isCorrect': isCorrect,
        'nextWord': List.head.val.original,
        'totalScore': List.totalScore,
        "wordCorrectCount": List.head.val.correct_count,
        "wordIncorrectCount": List.head.val.incorrect_count
      }
      
      res.send(feedback)
      
    } catch (error) {
      next(error)
    }

  })

module.exports = languageRouter
