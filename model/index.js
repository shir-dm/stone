import Games from './GamesModel'
import Game from './GameModel'

export default function (racer) {
  racer.orm('games', Games)
  racer.orm('games.*', Game)
}
