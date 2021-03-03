import { ANSWER } from 'helpers/constants'

const getWinner = (firstUserAnswer, secondUserAnswer) => {
  if (firstUserAnswer === secondUserAnswer) return null
  if (firstUserAnswer === ANSWER.SURRENDER.ID || ANSWER[secondUserAnswer.toUpperCase()].STRONGER.includes(firstUserAnswer)) return 'secondUser'
  // if (secondUserAnswer === ANSWER.SURRENDER.ID || ANSWER[firstUserAnswer.toUpperCase].STRONGER.includes(secondUserAnswer)) return 'firstUser'
  return 'firstUser'
}

const getCombo = (winner, lastCombo) => {
  if (winner === null) return lastCombo
  return winner
}

const getScore = (isWinner, isLastCombo, lastScore) => {
  if (!isWinner) return 0
  if (!isLastCombo) return 1
  return lastScore
}

export default (firstUserAnswer, secondUserAnswer, lastGame = {}) => {
  const winner = getWinner(firstUserAnswer, secondUserAnswer)
  const combo = getCombo(winner, lastGame.combo)
  const scoreFirstUser = getScore(winner === 'firstUser', lastGame.combo === 'firstUser', lastGame.allScoreFirstUser || 0)
  const scoreSecondUser = getScore(winner === 'secondUser', lastGame.combo === 'secondUser', lastGame.allScoreSecondUser || 0)
  const allScoreFirstUser = (lastGame.allScoreFirstUser || 0) + scoreFirstUser
  const allScoreSecondUser = (lastGame.allScoreSecondUser || 0) + scoreSecondUser

  return {
    winner,
    combo,
    scoreFirstUser,
    scoreSecondUser,
    allScoreFirstUser,
    allScoreSecondUser,
    firstUserAnswer,
    secondUserAnswer
  }
}
