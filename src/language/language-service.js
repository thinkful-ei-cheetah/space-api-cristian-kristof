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
  },
}

const wordFields = [
  'word.original AS original',
  'word.correct_count AS correctCount',
  'word.incorrect_count AS incorrectCount'
]

module.exports = LanguageService
