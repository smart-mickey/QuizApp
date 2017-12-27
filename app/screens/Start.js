'use strict';
/*jshint esversion: 6*//*jshint node: true*/
import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'

class Start extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            
        };
    };  

    componentDidMount() {
        
    }

    render(){
        return(
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('main')} style={styles.buttonView}>
                    <Text style={styles.buttonText}>Start Quiz</Text>
                </TouchableOpacity>
            </View>
        );
    };
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
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
    }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {   
  }
}, mapDispatchToProps)(Start);