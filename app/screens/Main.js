'use strict';
/*jshint esversion: 6*//*jshint node: true*/
import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, Alert} from 'react-native';
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
            score: 0
        }
    };  

    componentDidMount() {
        this.isMount = true
        this.props.getQuestions((data) => {
            this.setState({quiz: data})
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
            if(QUIZ.type=='boolean') checked = {} 
            checked[label] = !checked[label]
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
        if(this.state.index == 9){
            let s = this.state.score
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


    render(){
        const _this = this
        let QUIZ = {}
        let labels = []
        if(this.state.quiz.length > 0){
            QUIZ = this.state.quiz[this.state.index]
            if(QUIZ == undefined){
                return
            }
            if(typeof QUIZ.correct_answer == 'string') labels.push(QUIZ.correct_answer)
            else labels = labels.concat(QUIZ.correct_answer)
            
            if(typeof QUIZ.incorrect_answers == 'string') labels.push(QUIZ.incorrect_answers)
            else labels = labels.concat(QUIZ.incorrect_answers)
            
        }
        
        return(
        <View style={styles.container}>
            <View style={styles.timeView}>
                <Text style={styles.timeText}>{this.convertToClockTime(this.state.duration)}</Text>
            </View>
            <View style={styles.titleView}>
                {
                    this.state.quiz.length == 0?
                    <Text style={styles.quizText}>Loading...</Text>
                    :
                    <Text style={styles.quizText}>{(this.state.index + 1) + ': ' + decodeURIComponent(QUIZ.question)}</Text>
                }                
            </View>
            <View style={styles.answerView}>
                <ScrollView style={{flex: 1}}>
                    {
                        labels.map(function(label, index) {
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
                    {
                        labels.length > 0?
                        <View style={styles.nextButtonView}>
                            <TouchableOpacity onPress={() => this.onPressNext()} style={styles.buttonView}>
                                <Text style={styles.buttonText}>{this.state.index == 9 ? 'Finish Test' : 'Next Question'}</Text>
                            </TouchableOpacity>
                        </View>
                        :null
                    }
                    
                </ScrollView>
            </View>
        </View>
        );
    };
}


const styles = StyleSheet.create({
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
    labelText: {
        fontSize: 20,
        color: 'gray'
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
