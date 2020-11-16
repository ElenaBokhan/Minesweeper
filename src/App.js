import React, { Component } from 'react';
import backUrl from './background.jpg';
import './App.css';

class App extends Component {
	constructor(props){
		super(props)
		this.state = {
			countTable:10,			
			minesArr:[],			
			userFlagArr: [],
			userStepArr: [],
			gameOver:false,
			isWon: false,			
		}
	}
	componentDidMount(){
		const arr = new Set();
		while(arr.size<10){
			let number = Math.floor(Math.random()*100);
			arr.add(number);
		}
		this.setState({minesArr:Array.from(arr)});
	}

	nextStep = event => {
		const cell = +event.target.dataset.col;
		if (this.isStepOnFlag(cell)) return;
		if (this.isStepOnMine(cell)) return;		
		if (this.isEmptyCell(cell)) return;		
		this.showMinesAround(cell);	
		
		this.isWon();		
	}
	isWon = () => {	
		this.setState({});	
		if (new Set(this.state.userStepArr).size === 90){
			this.setState({ isWon:true });				
		}
		return
	}
	showMinesAround = cell => {		
		const neibourCellsArr = this.neighbourCells(cell);
		const countMinesAround = this.howMuchMinesAround(neibourCellsArr);
		const element = document.querySelector(`div[data-col="${cell}"]`);
		if (!this.state.userStepArr.includes(cell)) this.state.userStepArr.push(cell);			
		if (countMinesAround !== 0) element.innerText = countMinesAround;
		else {
			neibourCellsArr.forEach( el => this.showMinesAround(el) )
		}
	}
	
	neighbourCells = cell => {
		let neightbours;
		if (cell%10 === 9 || cell === 9) {
			neightbours = [cell-1,cell-11,cell-10,cell+9,cell+10];
		} 
		else if (cell%10 === 0) {
			neightbours = [cell-10,cell-9,cell+1,cell+10,cell+11];
		} 		
		else {
			neightbours = [cell+1,cell-1,cell-11,cell-10,cell-9,cell+9,cell+10,cell+11];
		}  
		return neightbours.filter( el => !this.state.userStepArr.includes(el) && el >= 0 && el < 100 )   
	}

	howMuchMinesAround = neighbourCells => {		
		return this.state.minesArr.reduce( (acc,item) => neighbourCells.includes(item) ? acc+=1 : acc, 0 )
	}

	isStepOnMine = cell => {		
		if (this.state.minesArr.includes(cell)){
			this.setState({ userStepArr:[...this.state.userStepArr, cell] });
			this.setState({ gameOver:true });
			return true
		}
		return false
	}

	isStepOnFlag = cell => {		
		if (this.state.userFlagArr.includes(cell)){			
			this.setState({ userFlagArr: this.state.userFlagArr.filter(el => el !== cell) })
			return true;		 			
		}
		return false
	}

	isEmptyCell = cell => {		
		return this.state.userStepArr.includes(cell)
	}

	setFlag = event => {
		event.preventDefault();		
		this.state.userFlagArr.push(+event.target.dataset.col)
		this.isWon();		
	}
	startNewGame = ()=> {
		window.location.reload();
	}
	render(){		
		return (<div style = {{backgroundImage: `url(${ backUrl })`}} className = "back">
					<span className = "title">MinesWeeper</span>
					<span className = "subtitle">Игра "Сапер". Раскрывай поле, не наступая на мины.</span>
					<div className = "field-wrap">
						<div className="field" 	onClick = { e => !this.state.gameOver && this.nextStep(e) } 
											onContextMenu = { e => !this.state.gameOver && this.setFlag(e) }>
							{[...Array(100).keys()].map( item => {
								return		<div  	className = {  this.state.userFlagArr.includes(item) ?  "flag"
															: this.state.userStepArr.includes(item) && this.state.minesArr.includes(item) ?  "step-on-mine"
															: this.state.userStepArr.includes(item) ? "user-step" : "field-item"}
												data-col = { item } 
												key = { item }>
										</div>})										
							}							
						</div>
						<div className = "result-wrap">
							<div className = "new-game" onClick = {()=> this.startNewGame()}>New game</div>
							<div className = "result">								
								{!this.state.isWon && !this.state.gameOver && "Your status"}											
								{this.state.isWon && "Y're WIN!"}
								{this.state.gameOver && "Game over"}																		 
							</div>						
						</div>
					</div>
				</div>
		);
	}  
}

export default App;
