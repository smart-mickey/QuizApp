'use strict';
/*jshint esversion: 6*//*jshint node: true*/
import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import CheckBox from 'react-native-checkbox'

const sample_quiz = {
    category: '',
    type: 'multiple',
    difficulty: 'medium',
    question: '',
    correct_answer: '', //string or array
    incorrect_answers: []//string or array
}

class Main extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            index: 0,
            quiz: [],
            duration: 0,
            checked: {},
            score: 0,
            labels: []
        }
    };  

    componentDidMount() {
        this.isMount = true
        this.props.getQuestions((data) => {
            this.setState({quiz: data})
            this.getLabels(data)
            this.startTimer()
        })
    }

    componentWillUnmount() {
        this.isMount = false
    }

    startTimer() {
        const _this = this
        setTimeout(function() {
            _this.setState({duration: _this.state.duration + 1})
            _this.isMount && _this.startTimer()
        }, 1000)
    }

    getLabels(data){
        const _this = this
        const {labels} = this.state
        data.map(function(quiz, index){
            let temp = []
            if(quiz.type == 'multiple'){
                if(typeof quiz.correct_answer == 'string') temp.push(quiz.correct_answer)
                else temp = temp.concat(quiz.correct_answer)                
                if(typeof quiz.incorrect_answers == 'string') temp.push(quiz.incorrect_answers)
                else temp = temp.concat(quiz.incorrect_answers)
            }
            else{//boolean
                temp.push(quiz.correct_answer)
                temp.push(quiz.incorrect_answers)
            }            
            temp = _this.shuffle(temp)
            labels[index] = temp
        })
        this.setState({labels})
    }

    convertToClockTime(T) {
        let M = Math.floor(T / 60)
        let S = T % 60
        return (M < 10 ? '0' : Math.floor(M / 10)) + (M % 10) + ':' + (S < 10 ? '0' : Math.floor(S / 10)) + (S % 10)
    }

    onChangedCheck(label) {
        //const prev = this.state.checked[index]
        const QUIZ = this.state.quiz[this.state.index]     
        let {checked} = this.state
        if(checked[label] == undefined){
            if(QUIZ.type=='boolean') checked = {} 
            checked[label] = true
        } 
        else{
            const prev = checked[label]
            if(QUIZ.type=='boolean') checked = {} 
            checked[label] = !prev
        }
        this.setState({checked})
    }

    onPressNext() {
        const {checked, index, score} = this.state   
        let answer = []
        let numberOfTrue = 0
        Object.keys(checked).map(function(key){
            if(checked[key] == true){
                answer.push(key)
                numberOfTrue++
            }
        })
        if(numberOfTrue == 0){
            alert("You selected nothing!")
            return
        }    

        if(this.checkQuestion(answer)){
            this.setState({score: score + 0.5})
        }
        if(index == 9){
            let s = score
            if(this.checkQuestion(answer)) s = s + 0.5
            this.isMount = false
            Alert.alert(
            'Your score is ' + s,
            'Would you like to test again?',
            [
                {text: 'No', onPress: () => this.props.navigation.goBack()},
                {text: 'Yes', onPress: () => {                    
                    this.setState({
                        index: 0,
                        score: 0,
                        duration: 0,
                        checked: {}
                    })
                    this.isMount = true
                    this.startTimer()
                }},
            ],
            { cancelable: false }
            )
        }
        else{
            this.setState({index: index + 1, checked: {}})
        }        
    }

    checkQuestion(answer) {
        const QUIZ = this.state.quiz[this.state.index]        
        if(answer.length == 0) return false
        if(typeof QUIZ.correct_answer == 'string' && QUIZ.correct_answer == answer[0] && answer.length == 1) return true
        else if(this.arraysEqual(QUIZ.correct_answer, answer)) return true
        else return false
    }

    arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;
      
        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
      
        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
    }

    shuffle(arra1) {
        var ctr = arra1.length, temp, index;
    
    // While there are elements in the array
        while (ctr > 0) {
    // Pick a random index
            index = Math.floor(Math.random() * ctr);
    // Decrease ctr by 1
            ctr--;
    // And swap the last element with it
            temp = arra1[ctr];
            arra1[ctr] = arra1[index];
            arra1[index] = temp;
        }
        return arra1;
    }


    render(){
        const _this = this
        const {index, labels, quiz} = this.state
        const QUIZ = quiz[index]
        if(labels.length == 0){
            return(
                <View style={styles.loadingView}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            )
        } 
        return(
        <View style={styles.container}>
            <View style={styles.timeView}>
                <Text style={styles.timeText}>{this.convertToClockTime(this.state.duration)}</Text>
            </View>
            <View style={styles.titleView}>
                <Text style={styles.quizText}>{(this.state.index + 1) + ': ' + decodeURIComponent(QUIZ.question)}</Text>
            </View>
            <View style={styles.answerView}>
                <ScrollView style={{paddingBottom: 40}}>
                    {
                        labels[index].map(function(label, index) {
                            return(
                                <View style={styles.labelItem} key={index}>
                                    <CheckBox
                                        checkboxStyle={{width: 15, height: 15, borderColor: 'black'}}
                                        label={decodeURIComponent(label)}
                                        checked={_this.state.checked[label] == true}
                                        onChange={(checked) => _this.onChangedCheck(label)}
                                    />
                                </View>
                            )
                        })
                    }
                    <View style={styles.nextButtonView}>
                        <TouchableOpacity onPress={() => this.onPressNext()} style={styles.buttonView}>
                            <Text style={styles.buttonText}>{this.state.index == 9 ? 'Finish Test' : 'Next Question'}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
        );
    };
}


const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        textAlign: 'center',
        color: 'gray'
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    timeView: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    timeText: {
        backgroundColor: 'transparent',
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold'
    },
    titleView: {
        paddingHorizontal: 20,
        paddingVertical: 40
    },
    quizText: {
        color: 'blue',
        textAlign: 'center',
        fontSize: 24
    },
    answerView: {
        flex: 1
    },
    labelItem: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 40
    },
    buttonView: {
        backgroundColor: 'blue',
        padding: 20,
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 20,
        backgroundColor: 'transparent',
        color: 'white'
    },
    nextButtonView: {
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {   
    appState: state.appState
  }
}, mapDispatchToProps)(Main);
