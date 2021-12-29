import React from 'react'
import './Chess.css'

import { Piece, Board, PieceColor, PieceType, EmptyPiece } from './ChessTypes'

const get_piece_image = (piece: Piece | EmptyPiece, lose: boolean = false) => {
    const image_path = `piece_image/${piece.color.slice(0, 1)}_${piece.type}` + (lose ? '-lose' : '') + `.png`
    const image_elm = piece.id === -1 ? <span></span> : <img src={image_path} alt="" className={'piece-image' + (lose ? '-lose' : '')} />
    return image_elm
}

interface ChessState {
    board: Board
}

class Chess extends React.Component {

    state: ChessState = {
        board: new Board()
    }


    check_movable() {
        const board: Board = Object.assign(this.state.board)
        board.movable = []

        const selected_piece = this.state.board.current()
        const color = selected_piece.color
        const cursor = board.cursor

        switch (selected_piece.type) {
            case PieceType.Pawn:
                const direction = color === PieceColor.Black ? 1 : -1
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
            if (board.layout[r2][c2] !== -1) {
                const p = board.pieces[board.layout[r2][c2]]
                const grave = board.grave.get(p.color)
                if (grave !== undefined) {
                    grave.push(p.id)
                    board.grave.set(p.color, grave)
                }
            }

            board.layout[r2][c2] = this.state.board.layout[r1][c1]
            board.layout[r1][c1] = -1
        }

        for(const color of Object.values(PieceColor)){
            const g = board.grave.get(color)
            if(g !== undefined){
                if(g.find((pi: number) => board.pieces[pi].type == PieceType.King) !== undefined){
                    alert(color + ' lose')
                }
            }
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

    pixel_element(r: number, c: number): JSX.Element {
        return <td
            key={`key${c}`}
            className={this.class_tag(r, c)}

            onClick={
                (
                    () => this.state.board.selected ? this.place(r, c) : this.pick(r, c)
                )
            }
        >
            {get_piece_image(this.state.board.at(r, c))}
        </td>
    }

    grave_element() {
        let rev: Array<JSX.Element> = new Array();
        for (const color of Object.values(PieceColor)) {
            const grave = this.state.board.grave.get(color)
            if (grave === undefined) {
                continue
            }

            // const image_path = `piece_image/${piece.color.slice(0, 1)}_${piece.type}.png`
            // const image_elm = piece.id === -1 ? "" : <img src={image_path} className='piece-image' alt="" />

            rev.push(
                <div key={color} className={'lose-' + color}>
                    <h6>{color}</h6>
                    <ul>
                        {
                            grave.map((id, index) =>
                                <li key={index}>
                                    {get_piece_image(this.state.board.pieces[id], true)}
                                    <span>: {this.state.board.pieces[id].type}</span>
                                </li>)
                        }
                    </ul>
                </div>)

            rev.push(<hr></hr>)
        }
        return rev
    }

    render() {
        return (
            <div className='content section'>
                <h1>chess game</h1>

                <div className='columns'>
                    <div className='column is-8'>
                        <table className='table'>
                            <tbody>
                                {
                                    this.state.board.layout.map(
                                        (row, rindex) =>
                                            <tr key={`row${rindex}`}>
                                                {row.map((col, cindex) => this.pixel_element(rindex, cindex))}
                                            </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className='column is-4'>
                        {this.grave_element()}
                    </div>
                </div>

            </div>

        )
    }
}

export default Chess
