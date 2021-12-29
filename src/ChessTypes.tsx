import React from 'react'

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
    grave: Map<string, Array<number>>

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

        this.grave = new Map<string, Array<number>>()
        for (const color of Object.values(PieceColor)) {
            this.grave.set(color, new Array<number>())
        }

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

export { PieceType }
export { PieceColor }
export { Piece }
export { EmptyPiece }
export { Board }