import { BaseModel } from 'startupjs/orm'
import { ANSWER, GAME_STATUS } from 'helpers/constants'

export default class GameModel extends BaseModel {
  setAnser (isFirstUser, value) {
    const { firstUserAnswer, secondUserAnswer } = this.getCurrentRound()
    const userAnswer = isFirstUser ? 'firstUserAnswer' : 'secondUserAnswer'
    const id = (this.get('history')).length - 1
    this.set(`history.${id}.${userAnswer}`, value)

    if (secondUserAnswer || firstUserAnswer) {
      const lastGame = this.getLastGame()
      const winner = this.getWinner()
      const combo = this.getCombo(winner, lastGame.combo)
      const scoreFirstUser = this.getScore(winner === 'firstUser', lastGame.combo === 'firstUser', lastGame.allScoreFirstUser || 0)
      const scoreSecondUser = this.getScore(winner === 'secondUser', lastGame.combo === 'secondUser', lastGame.allScoreSecondUser || 0)
      const allScoreFirstUser = (lastGame.allScoreFirstUser || 0) + scoreFirstUser
      const allScoreSecondUser = (lastGame.allScoreSecondUser || 0) + scoreSecondUser

      this.set(`history.${id}`, {
        winner,
        combo,
        scoreFirstUser,
        scoreSecondUser,
        allScoreFirstUser,
        allScoreSecondUser,
        firstUserAnswer: firstUserAnswer || value,
        secondUserAnswer: secondUserAnswer || value
      })
      this.set('status', GAME_STATUS.WAITING_NEW_ROUND)
    }
  }

  getCurrentRound () {
    const history = this.get('history')
    return history[history.length - 1]
  }

  getLastGame () {
    const history = this.get('history')
    return history[history.length - 2] || {}
  }

  getWinner () {
    const { firstUserAnswer, secondUserAnswer } = this.getCurrentRound()
    if (firstUserAnswer === secondUserAnswer) return null
    if (firstUserAnswer === ANSWER.SURRENDER.ID || ANSWER[secondUserAnswer.toUpperCase()].STRONGER.includes(firstUserAnswer)) return 'secondUser'
    // if (secondUserAnswer === ANSWER.SURRENDER.ID || ANSWER[firstUserAnswer.toUpperCase()].STRONGER.includes(secondUserAnswer)) return 'firstUser'
    return 'firstUser'
  }

  getCombo (winner, lastCombo) {
    if (winner === null) return lastCombo
    return winner
  }

  getScore (isWinner, isLastCombo, lastScore) {
    if (!isWinner) return 0
    if (!isLastCombo) return 1
    return lastScore
  }
}
