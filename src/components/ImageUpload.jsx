import React, { Component } from 'react';
import { storage } from '../firebase';
import { Button, Progress, Segment, Loader, Dimmer, Statistic, Grid } from 'semantic-ui-react';
import ReactTypingEffect from 'react-typing-effect';

class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            url: '',
            progress: 0,
            act_preds: '',
            prob_preds: '',
            isLoading: false,
            showResult: false,
            preds_label: [],
            preds_per: [],
            uploaded: false,
            selected: false

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.fileInputRef = React.createRef()





    }



    handleChange = e => {
        if (e.target.files[0]) {
            const image = e.target.files[0];

            this.setState(() => ({ image: image, selected: true }));

        }
    }

    handleUpload = () => {
        const { image } = this.state;
        // get bucket name
        const uploadTask = storage.ref(`images/${image.name}`).put(image)

        uploadTask.on('state_changed',
            (snapshot) => {
                // progress of the upload
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                this.setState({ progress })
            },
            (err) => {
                // gets error if any
                console.log(err)
            },
            () => {
                // complete function (zero argument function)
                // get image url
                storage.ref('images').child(image.name).getDownloadURL().then(url => {
                    console.log(url)
                    //  this.state.url = url;
                    this.setState({ url: url, uploaded: true })
                })



            })

    }

    createStastics = (preds_tuple) => {
        let stastics = []
        const color_array = ['red', 'green', 'blue', 'orange', 'purple', 'yellow', 'brown', 'olive', 'teal', 'violet']

        let pred_tup = preds_tuple.toString()
        let _pred_split = pred_tup.split(',')
        _pred_split.forEach((item) => {
            console.log(item.split(":")[0])
            console.log(item.split(":")[1])

            stastics.push(
                // <Statistic color={color_array[Math.floor(Math.random() * 10)]} inverted>
                //     <Statistic.Value>{item.split(":")[1]}</Statistic.Value>
                //     <Statistic.Label>{item.split(":")[0]}</Statistic.Label>
                // </Statistic>
                <Progress style = {{minWidth: '400px', border: '2px solid white', color: 'white'}} color = {color_array[Math.floor(Math.random() * 10)]} percent = {item.split(":")[1]} progress = 'percent' label = {item.split(":")[0]}  />
            )
        })

        return stastics;

    }




    render() {
        const styles = {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',

        };
        const barStyle = {
            width: '400px',
            border: '2px solid green',
            marginTop: '20px'

        };

        const uploadButton = {
            marginLeft: '5px',
            marginTop: '10px',
            border: '2px solid green'

        }
        const browseButton = {
            marginRight: '5px',
            marginTop: '10px',
            border: '2px solid green'
        }
        const predStyles = {
            marginTop: '10px'
        }

        const placeholderStyles = {
            borderRadius: '4px',
            border: '2px solid white'
        }

        const predButtonStyles = {
            border: '2px solid green'
        }

        return (
            <Segment>
                {this.state.isLoading ? <PredLoader /> : null}
                <Grid stackable columns={2}>
                    <Grid.Column width={8} >
                        <Segment style={styles}>
                            <h1><ReactTypingEffect
                                text="Why don't you check yourself out?" /> </h1>
                            <img style={placeholderStyles} src={this.state.url || 'https://firebasestorage.googleapis.com/v0/b/celeba-image-storage.appspot.com/o/images%2Fplaceholder.jpg?alt=media&token=56a1a19d-39b7-4bd3-a76b-27417814ea72'} height="300" width="300" />
                            <Button.Group>
                                <Button style={browseButton} content='Choose File' labelPosition='left' icon='file' onClick={() => this.fileInputRef.current.click()} />

                                <input ref={this.fileInputRef} type='file' hidden onChange={this.handleChange} />
                                {this.state.selected ?
                                    <Button style={uploadButton} content='Upload' labelPosition='left' icon='cloud upload' onClick={this.handleUpload} /> :
                                    <Button style={uploadButton} content='Upload' labelPosition='left' icon='cloud upload' disabled />
                                }
                            </Button.Group>

                            {this.state.selected ?

                                <Progress style={barStyle} percent={this.state.progress} max="100" progress color='green' /> :
                                null
                            }


                            {this.state.uploaded ? <Button style={predButtonStyles} content='Predict' labelPosition='left' icon='search' onClick={
                                async () => {
                                    const file = this.state.url;
                                    this.setState({ isLoading: true });
                                    await fetch('http://localhost:5000/predict_api', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(file)
                                    }).then((response) => {
                                        return response.json()
                                    }).then((data) => {
                                        const items = data;
                                        let preds_pp = items.preds_prob;
                                        let pp = preds_pp.join(", ");
                                        this.setState({ act_preds: items.predicitions, prob_preds: pp, showResult: true, isLoading: false })

                                        const xd = items.preds_prob.toString();
                                        const x_ = xd.split(',')
                                        x_.forEach((item) => {
                                            // console.log(item)
                                            let xx = item
                                            let c_ = item.split(":")
                                            this.setState(state => {
                                                state.preds_label.push(c_[0]);
                                                state.preds_per.push(parseFloat(c_[1]))
                                            })
                                            // this.setState({preds_label.concat(c_[0]), preds_per.concat(c_[1])})
                                            // console.log(c_[0], c_[1])
                                        });


                                    })

                                }
                            } /> : <Button style={predButtonStyles} content='Predict' labelPosition='left' icon='search' disabled />}

                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={8} >
                        <Segment style={styles}>
                            {this.state.showResult ?
                                <h1>
                                    <ReactTypingEffect text="Got your details..." />
                                </h1> : <h1>
                                    Your details will land here..
                        </h1>
                            }
                            {/* {this.state.isLoading ? <PredLoader /> : null} */}

                            {
                                this.state.showResult ? <div>
                                    {this.createStastics(this.state.prob_preds)}
                                </div> : null
                            }
                        </Segment>

                    </Grid.Column>


                </Grid>
            </Segment>







        )

    }



}



class PredLoader extends React.Component {
    render() {
        return (
            <Dimmer active>
                <Loader indeterminate>
                    Getting Details
                </Loader>
            </Dimmer>
        )
    }
}

class Specs extends React.Component {
    render() {
        return (
            <Segment>
                {this.props.pred_prob}
            </Segment>


        )
    }
}



export default ImageUpload