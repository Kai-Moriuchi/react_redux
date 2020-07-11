import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';

type SquareType = string | null;

//Squareのプロパティ
interface SquareProps {
    value: SquareType;
    onClick: () => void;
}

interface SquareState {
    value: string | null;
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
function Square(props: any) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

interface BoardState {
    squares:SquareType[];
    xIsNext:boolean; 
}

//BoardはReactコンポーネントクラス．propsを受け取り，renderを通して表示するビューの階層構造を返す．
class Board extends React.Component<any, BoardState> {
    constructor(props: any) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }

    handleClick(i: any) {
        const squares = this.state.squares.slice();//sliceを呼ぶことで配列のコピーを作成．
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }

    renderSquare(i: any) {
        return (
        <Square 
        value={this.state.squares[i]} 
        onClick={()=> this.handleClick(i)}
        />
        );
    }

    //renderが返すのは画面上に表示したい説明書きのこと．
    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if(winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div>
                <div className="status">{status}</div>
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

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares : any) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
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