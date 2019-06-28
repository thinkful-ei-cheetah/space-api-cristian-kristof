const LinkedList = require('../linkedlist')

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  getWord(db, language_id) {
    return db 
      .from('language AS lang')
      .select(
        'lang.id',
        'lang.total_score AS totalScore',
        ...wordFields,
      )
      .leftJoin(
        'word',
        'lang.head',
        'word.id',
      )
      .where('lang.id', language_id)
      .first()
  },

  createLL(words, head, totalScore) {
    const LL = new LinkedList({totalScore: totalScore})
    let word = words.find(wrd => wrd.id === head)

    LL.insertFirst(word)

    words.forEach(word => {
      if (word.next) {
        word = words.find(wrd => wrd.id === word.next)
        LL.insertLast(word)
      }
    })

    return LL
  },

  saveUpdates(db, list, languageId) {
    return db.transaction(async trx => {
      await trx('language')
        .where('id', languageId) 
        .update({
          total_score: list.totalScore,
          head: list.head.val.id
        }) 
      
      let currWord = list.head
      while (currWord.next !== null) {
        await trx('word')
          .where('id', currWord.val.id)
          .update({
            memory_value: currWord.val.memory_value,
            correct_count: currWord.val.correct_count,
            incorrect_count: currWord.val.incorrect_count,
            next: currWord.next !== null ? currWord.next.val.id : null,
          })
        currWord = currWord.next
      }
    })
  }
}

const wordFields = [
  'word.original AS original',
  'word.correct_count AS correctCount',
  'word.incorrect_count AS incorrectCount'
]

module.exports = LanguageService
