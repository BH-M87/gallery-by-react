require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

import ReactDOM from 'react-dom'

// get image related data
import imageDatasJson from '../data/imageDatas.json';
// let imageDatasJson = require('../data/imageDatas.json');

let genImageURL = (imageDatasArr) => {
	imageDatasArr.forEach((singleImageData, index, imageDatasArr) => {
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
	})
	return imageDatasArr;
}

var imageDatas = genImageURL(imageDatasJson.imageDatas);

/*get random value between low and high*/
let getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);

/*get random angle between -30 degree and 30 degree*/
let get30DegRandom = () => (Math.random() > 0.5 ? 1 : -1) * Math.random() * 30;

class ImgFigure extends React.Component {
	handleClick(e) {
		//Keep the following two lines in mind, or this event will be triggered twice
		e.stopPropagation();
		e.preventDefault();
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
	}
	render() {
		let styleObj = this.props.arrange.pos || {};
		if (this.props.arrange.rotate) {
			['MozTransform', 'MsTransform', 'WebkitTransform', 'transform'].forEach(value => styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)');
		}
		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		let imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick.bind(this)}>
						<p>
							{this.props.data.description}
						</p>
					</div>
				</figcaption>
			</figure>
		)
	}
}

//Controller unit
class ControllerUnit extends React.Component {
	// constructor(){

	// }
	handleClick(e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		e.preventDefault();
		e.stopPropagation();
	}
	render() {
		let controllerUnitClassName = "controller-unit";
		if (this.props.arrange.isCenter) {
			controllerUnitClassName += " is-center";
			if (this.props.arrange.isInverse) {
				controllerUnitClassName += " is-inverse";
			}
		}
		return (
			<span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
		)
	}
}
class AppComponent extends React.Component {
	constructor() {
		super();
		this.constant = {
			centerPos: {
				left: 0,
				top: 0
			},
			centerRotate: 0,
			hPosRange: { //horizontal value range
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			vPosRange: { //vertical value range
				x: [0, 0],
				topY: [0, 0]
			}
		};
		this.state = {
			imgsArrangeArr: [
				/*{
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}*/
			]
		};
	}

	/*
	 * inverse picture
	 * @param index the index number of the inverse picture
	 * @return
	 *
	 */
	inverse(index) {
		return () => {
			let imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			})
		}
	}

	/*
	 * rearrange all the picture
	 * @param centerIndex the index number of the center picture
	 *
	 */
	rearrange(centerIndex) {
		let imgsArrangeArr = this.state.imgsArrangeArr,
			constant = this.constant,
			centerPos = constant.centerPos,
			centerRotate = constant.centerRotate,
			hPosRange = constant.hPosRange,
			vPosRange = constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2), // get one or two picture(s) to put it or them on the top
			topImgSpliceIndex = 0,

			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

		//first, put the centerIndex picture in the middle of the stage, with rotate
		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: centerRotate,
			isCenter: true
		}

		//get states of the picture on the top
		topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		//top pictures layout
		imgsArrangeTopArr.forEach((value) => {
			value = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
		})

		//left and right pictures layout
		for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			let hPosRangeLORX = i < k ? hPosRangeLeftSecX : hPosRangeRightSecX;
			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
		}

		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}

		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		})
	}

	/*
	 * center the picture by using rearrange function
	 * @param index the index number of the center picture
	 * @return {Function}
	 *
	 */
	center(index) {
		return () => {
			this.rearrange(index);
		}
	}
	componentDidMount() {
		/*scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。

		clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。

		offsetWidth：对象整体的实际宽度，包滚动条等边线，会随对象显示大小的变化而改变。*/
		const stageDom = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDom.scrollWidth,
			stageH = stageDom.scrollHeight,
			halfStageW = Math.floor(stageW / 2),
			halfStageH = Math.floor(stageH / 2);

		const imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.floor(imgW / 2),
			halfImgH = Math.floor(imgH / 2);

		this.constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}
		this.constant.hPosRange.leftSecX[0] = -halfImgW;
		this.constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.constant.hPosRange.y[0] = -halfImgH;
		this.constant.hPosRange.y[1] = stageH - halfImgH;

		this.constant.vPosRange.topY[0] = -halfImgH;
		this.constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.constant.vPosRange.x[0] = halfStageW - imgW;
		this.constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);
	}
	render() {
		let controllerUnits = [],
			imgFigures = [];
		imageDatas.forEach((value, index) => {
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			}
			imgFigures.push(<ImgFigure key={index} ref={'imgFigure' + index} data={value} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
			controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		});
		return (
			<section className="stage" ref="stage">
    			<section className="img-sec">
    				{imgFigures}
    			</section>
    			<nav className="controller-nav">
    				{controllerUnits}
    			</nav>
    	</section>
		);
	};
}

AppComponent.defaultProps = {};

export default AppComponent;
