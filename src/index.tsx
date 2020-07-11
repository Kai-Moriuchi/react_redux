import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import { setPriority } from 'os';

//Squareのプロパティ
interface SquareProps {
    value: any;
    onClick: () => void;
}

/*class Square extends React.Component<SquareProps, SquareState> {
    render() {
        return (
            <button
                className="square"
                onClick={() => this.props.onClick()}
            >
                {this.props.value}
            </button>
        );
    }
}*/

//Squareを関数コンポーネント化
function Square(props: SquareProps) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

interface BoardProps {
    squares: ('O' | 'X' | null)[];
    onClick: (i: number) => void;
}

//BoardはReactコンポーネントクラス．propsを受け取り，renderを通して表示するビューの階層構造を返す．
class Board extends React.Component<BoardProps, {}> {
    /*constructor(props: any) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }*/

    renderSquare(i: number) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    //renderが返すのは画面上に表示したい説明書きのこと．
    render() {
        /*const winner = calculateWinner(this.state.squares);
        let status;
        if(winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }*/

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

interface HistoryData {
    squares: ('O' | 'X' | null)[];
}

interface GameState {
    history: HistoryData[];
    xIsNext: boolean;
    stepNumber: number;
}

class Game extends React.Component<{}, GameState> {
    constructor(props: any) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }

    handleClick(i: number) {
        const history = this.state.history;
        const current = history[history.length - 1]
        let squares = current.squares.slice();//sliceを呼ぶことで配列のコピーを作成．
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step: number) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move} >
                    <button onClick={() => this.jumpTo(move)}> {desc}</button>
                </li>
            )
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

//勝者判定の関数
function calculateWinner(squares: any) {
    const lines = [
        //横
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        //縦
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        //斜め
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}