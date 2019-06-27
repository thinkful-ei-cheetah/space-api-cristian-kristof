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
      next()
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
        nextWord: word[0].original,
        totalScore: word[0].totalScore,
        wordCorrectCount: word[0].correctCount,
        wordIncorrectCount: word[0].incorrectCount
      }


      res.send(result)
      next()
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
      const words = await LanguageService.getLLData(
        req.app.get('db'),
        req.language.id
      )

      const List = await LanguageService.createLL(words)

      const firstQ = await List.getFirst()

      const nextQ = await List.getNext()

      const {
        translation,
        memory_value, 
        incorrect_count, 
        correct_count,
        totalScore
      } = firstQ
        
      const isCorrect = await function() {
        if (guess !== translation) {
          this.memory_value = 1
          this.incorrect_count += 1
          return false
        } else if (guess === translation) {
          this.memory_value = memory_value * 2 
          this.correct_count += 1
          this.totalScore += 1
          return true
        }
        List.moveTo(this.memory_value)
      }
      

      const feedback = {
        'answer': translation,
        'isCorrect': isCorrect(),
        'nextWord': nextQ.original,
        'totalScore': totalScore,
        "wordCorrectCount": correct_count,
        "wordIncorrectCount": incorrect_count
      }

      res.send(feedback)
      
      next()
    } catch (error) {
      next(error)
    }

  })

module.exports = languageRouter
