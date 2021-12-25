import React from 'react'
import './App.css'

// import w_bishop from './w_Bishop.png'

const PieceType = { Pawn: 'pawn', Rook: 'rook', Knight: 'knight', Bishop: 'bishop', Queen: 'queen', King: 'king' } as const
type PieceType = typeof PieceType[keyof typeof PieceType]

const PieceColor = { Black: 'black', White: 'white' } as const
type PieceColor = typeof PieceColor[keyof typeof PieceColor]

class Piece {
  id: number
  type: PieceType
  color: PieceColor

  constructor(id: number, type: PieceType, color: PieceColor) {
    this.id = id
    this.type = type
    this.color = color
  }
}

class EmptyPiece {
  id = -1
  type = 'empty'
  color = 'transparent'
}

class Board {
  layout: Array<Array<number>>
  pieces: Array<Piece>

  rows = 8
  columns = 8

  cursor: [number, number] = [-1, -1]
  selected = false
  movable: Array<[number, number]> = []

  constructor() {
    this.pieces = new Array<Piece>()

    for (let i = 0; i < 8; i++) this.pieces.push(new Piece(i, PieceType.Pawn, PieceColor.Black))
    this.pieces.push(new Piece(8, PieceType.Rook, PieceColor.Black))
    this.pieces.push(new Piece(9, PieceType.Knight, PieceColor.Black))
    this.pieces.push(new Piece(10, PieceType.Bishop, PieceColor.Black))
    this.pieces.push(new Piece(11, PieceType.Queen, PieceColor.Black))
    this.pieces.push(new Piece(12, PieceType.King, PieceColor.Black))
    this.pieces.push(new Piece(13, PieceType.Bishop, PieceColor.Black))
    this.pieces.push(new Piece(14, PieceType.Knight, PieceColor.Black))
    this.pieces.push(new Piece(15, PieceType.Rook, PieceColor.Black))

    for (let i = 16; i < 24; i++) this.pieces.push(new Piece(i, PieceType.Pawn, PieceColor.White))
    this.pieces.push(new Piece(24, PieceType.Rook, PieceColor.White))
    this.pieces.push(new Piece(25, PieceType.Knight, PieceColor.White))
    this.pieces.push(new Piece(26, PieceType.Bishop, PieceColor.White))
    this.pieces.push(new Piece(27, PieceType.Queen, PieceColor.White))
    this.pieces.push(new Piece(28, PieceType.King, PieceColor.White))
    this.pieces.push(new Piece(29, PieceType.Bishop, PieceColor.White))
    this.pieces.push(new Piece(30, PieceType.Knight, PieceColor.White))
    this.pieces.push(new Piece(31, PieceType.Rook, PieceColor.White))

    this.layout = new Array<Array<number>>()

    for (let r = 0; r < this.rows; r++) {
      this.layout.push([...Array(this.columns)].map(_ => -1))
    }

    for (let i = 0; i < this.columns; i++) this.layout[1][i] = i
    for (let i = 0; i < this.columns; i++) this.layout[0][i] = i + 8

    for (let i = 0; i < this.columns; i++) this.layout[6][i] = i + 16
    for (let i = 0; i < this.columns; i++) this.layout[7][i] = i + 24
  }

  at(rowIndex: number, columnIndex: number): Piece | EmptyPiece {
    if (rowIndex < 0 || this.rows <= rowIndex || columnIndex < 0 || this.columns <= columnIndex) {
      return new EmptyPiece()
    }

    const pieceid = this.layout[rowIndex][columnIndex]
    const piece = this.pieces.find(p => p.id === pieceid)

    return piece === undefined ? new EmptyPiece() : piece
  }

  current(): Piece | EmptyPiece {
    return this.at(this.cursor[0], this.cursor[1])
  }
}

interface AppState {
  board: Board
}

class App extends React.Component {

  state: AppState = {
    board: new Board()
  }

  constructor(prop: {}) {
    super(prop)
    // this.move = this.move.bind(this)
  }

  check_movable() {
    const board: Board = Object.assign(this.state.board)
    board.movable = []

    const selected_piece = this.state.board.current()
    const color = selected_piece.color
    const cursor = board.cursor

    switch (selected_piece.type) {
      case PieceType.Pawn:
        const direction = color === 'black' ? 1 : -1
        if (board.at(cursor[0] + direction, cursor[1]).id === -1) {
          board.movable.push([cursor[0] + direction, cursor[1]])

          if (
            ((direction === 1 && cursor[0] === 1) || (direction === -1 && cursor[0] === 6)) &&
            board.at(cursor[0] + direction * 2, cursor[1]).id === -1
          ) {
            board.movable.push([cursor[0] + direction * 2, cursor[1]])
          }

        }

        if (
          board.at(cursor[0] + direction, cursor[1] + 1).id !== -1 &&
          board.at(cursor[0] + direction, cursor[1] + 1).color !== color
        ) {
          board.movable.push([cursor[0] + direction, cursor[1] + 1])
        }

        if (
          board.at(cursor[0] + direction, cursor[1] - 1).id !== -1 &&
          board.at(cursor[0] + direction, cursor[1] - 1).color !== color
        ) {
          board.movable.push([cursor[0] + direction, cursor[1] - 1])
        }
        break

      case PieceType.Rook:
        const rook_direction = [[1, 0], [-1, 0], [0, 1], [0, -1]]

        for (let dir of rook_direction) {

          let point: [number, number] = [cursor[0], cursor[1]]
          while (true) {
            point = Object.assign(point)
            point[0] += dir[0]
            point[1] += dir[1]

            if (point[0] < 0 || board.rows <= point[0] || point[1] < 0 || board.columns <= point[1]) break

            if (board.at(point[0], point[1]).id === -1) {
              board.movable.push([point[0], point[1]])
              // board.movable.push(point)
            }
            else {
              if (board.at(point[0], point[1]).color !== color) board.movable.push(point)
              break
            }

          }
        }

        break

      case PieceType.Knight:
        const knight_tips = [
          [2, -1], [2, 1], [-2, 1], [-2, -1],
          [1, 2], [1, -2], [-1, 2], [-1, -2],
        ]

        for (let tip of knight_tips) {

          if (board.at(cursor[0] + tip[0], cursor[1] + tip[1]).color !== color) {
            board.movable.push([cursor[0] + tip[0], cursor[1] + tip[1]])
          }
        }
        break

      case PieceType.Bishop:
        const biship_direction = [[1, 1], [1, -1], [-1, 1], [-1, -1]]

        for (let dir of biship_direction) {

          let point: [number, number] = [cursor[0], cursor[1]]
          while (true) {
            point = Object.assign(point)
            point[0] += dir[0]
            point[1] += dir[1]

            if (point[0] < 0 || board.rows <= point[0] || point[1] < 0 || board.columns <= point[1]) break

            if (board.at(point[0], point[1]).id === -1) {
              board.movable.push([point[0], point[1]])
              // board.movable.push(point)
            }
            else {
              if (board.at(point[0], point[1]).color !== color) board.movable.push(point)
              break
            }

          }
        }

        break

      case PieceType.Queen:
        const queen_direction = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]


        for (let dir of queen_direction) {

          let point: [number, number] = [cursor[0], cursor[1]]
          while (true) {
            point = Object.assign(point)
            point[0] += dir[0]
            point[1] += dir[1]

            if (point[0] < 0 || board.rows <= point[0] || point[1] < 0 || board.columns <= point[1]) break

            if (board.at(point[0], point[1]).id === -1) {
              board.movable.push([point[0], point[1]])
              // board.movable.push(point)
            }
            else {
              if (board.at(point[0], point[1]).color !== color) board.movable.push(point)
              break
            }

          }
        }

        break

      case PieceType.King:
        const king_tips = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1], [0, 1],
          [1, -1], [1, 0], [1, 1],
        ]

        for (let tip of king_tips) {

          if (board.at(cursor[0] + tip[0], cursor[1] + tip[1]).color !== color) {
            board.movable.push([cursor[0] + tip[0], cursor[1] + tip[1]])
          }
        }
        break
    }

    this.setState({ board })
  }

  pick(r: number, c: number) {
    if (r < 0 || this.state.board.rows <= r || c < 0 || this.state.board.columns <= c) {
      return
    }

    if (this.state.board.at(r, c).id === -1) {
      return
    }

    const board: Board = Object.assign(this.state.board)
    board.cursor = [r, c]

    board.selected = true
    this.setState({ board })

    this.check_movable()
  }

  place(r: number, c: number) {
    if (this.state.board.selected) {
      this.move(this.state.board.cursor[0], this.state.board.cursor[1], r, c)
    }

    const board: Board = Object.assign(this.state.board)
    board.selected = false
    board.movable = []
    this.setState({ board })
  }

  move(r1: number, c1: number, r2: number, c2: number) {
    const board: Board = Object.assign(this.state.board)

    let move_ok = true
    move_ok = move_ok && (board.movable.find(pixel => { return pixel[0] === r2 && pixel[1] === c2 }) !== undefined)
    move_ok = move_ok && (r1 !== r2 || c1 !== c2)

    if (move_ok) {
      board.layout[r2][c2] = this.state.board.layout[r1][c1]
      board.layout[r1][c1] = -1
    }

    board.cursor = [-1, -1]
    this.setState({ board })
  }

  class_tag(r: number, c: number): string {
    let tags: Array<string> = []

    if ((r + c) % 2 === 0) { tags.push("even-pixel") }
    else { tags.push("odd-pixel") }

    if (this.state.board.cursor[0] === r && this.state.board.cursor[1] === c) { tags.push("selected-pixel") }

    if (this.state.board.movable.find(point => point[0] === r && point[1] === c) !== undefined) {
      tags.push('movable-pixel')
    }

    tags.push("pixel")
    return tags.join(" ")
  }

  render() {
    return (
      <div className='section content'>
        <table>
          <tbody>
            {
              this.state.board.layout.map(
                (row, rindex) =>
                  <tr key={`row${rindex}`}>
                    {
                      row.map((col, cindex) =>
                        <td
                          height="50"
                          key={`key${cindex}`}
                          className={this.class_tag(rindex, cindex)}

                          onClick={
                            (
                              () => this.state.board.selected ? this.place(rindex, cindex) : this.pick(rindex, cindex)
                            )
                          }
                        >
                          <span className={this.state.board.at(rindex, cindex).color + '-piece'}>
                            {this.state.board.at(rindex, cindex).type === 'empty' ? '' : this.state.board.at(rindex, cindex).type}
                          </span>
                        </td>)
                    }
                  </tr>
              )
            }
          </tbody>
        </table>
      </div>

    )
  }
}

export default App
