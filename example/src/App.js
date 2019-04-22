import React, { Component } from 'react'

import samplePlaylist from './sample_playlist'

import {CastPlayerController} from 'castplayer'


export default class App extends Component {
	render() {
		return <CastPlayerController chromecastReceiverApplicationId='4F8B3483' playlist={samplePlaylist} ></CastPlayerController>
	}

}
