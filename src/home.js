import React, { Component } from 'react';
import {TouchableOpacity, ImageBackground, ScrollView, StatusBar, Image, View, Text, SafeAreaView, Dimensions,
 Platform,FlatList,SectionList,StyleSheet } from 'react-native'
 import Realm from "realm";
 import { getRealmApp } from "../getRealmApp";
 import { Task,Profile } from "../schemas";

 const app = getRealmApp();
 var user
class Home extends Component {

  constructor() {
    super();
    this.realmRef = React.createRef();
    this.realmRef2 = React.createRef();
    this.state = {
        user:null
      
    };
  }
  componentDidMount() {
    
  }

  onLoadData= async ()=>{
    // const creds = Realm.Credentials.emailPassword("12345", "12345678");

    // const newUser = await app.logIn(creds);
    const config = {
        sync: {
          user:user,
          partitionValue: `user=${user.id}`,
        },
      };
  
      // Open a realm with the logged in user's partition value in order
      // to get the projects that the logged in user is a member of
      Realm.open(config).then((userRealm) => {
        this.realmRef.current = userRealm;
        const users = userRealm.objects("User");

        console.log(users)
  
        // users.addListener(() => {
        //   // The user custom data object may not have been loaded on
        //   // the server side yet when a user is first registered.
        //   console.log()
        // });
      });
  
  }
  onLoadProData=async ()=>{
    const OpenRealmBehaviorConfiguration = {
        type: 'openImmediately',
      };
      const config = {
        sync: {
          user: user,
          partitionValue: `user=${user.id}`,
          newRealmFileBehavior: OpenRealmBehaviorConfiguration,
          existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
        },
      };
      // open a realm for this particular project
      Realm.open(config).then((projectRealm) => {
        this.realmRef2.current = projectRealm;
  
        const syncTasks = projectRealm.objects("Profile");
        let sortedTasks = syncTasks.sorted("name");
        console.log(sortedTasks)
        // setTasks([...sortedTasks]);
        // sortedTasks.addListener(() => {
        //   setTasks([...sortedTasks]);
        // });
      });
  
  }
  onCreateProfile(){
        const projectRealm = this.realmRef2.current;
        projectRealm.write( async() => {
          // Create a new task in the same partition -- that is, in the same project.
        var data= await  projectRealm.create(
            "Profile",
            new Profile({
              name: "Naveen",
              partition: `user=${user.id}`,
            })
          );
          console.log(data)
        });
       
      
  }

 signUp = async () => {
 let sign=   await app.emailPasswordAuth.registerUser('9112345', '9112345678');
 console.log(sign)
  };
 signIn = async () => {
    const creds = Realm.Credentials.emailPassword("9112345", "9112345678");

    var newUser = await app.logIn(creds);
    console.log(newUser.id)
     user=newUser
    // let obj = Object.assign({}, newUser);
    // console.log(obj)
    // this.setState({
    //     user:obj
    // },()=>{
    //     console.log(this.state.user)
    // })
    // setUser(newUser);
  };


    render() {
     
        return (
             <View>
                 <TouchableOpacity onPress={()=>this.signUp()} style={{height:30, width:60, backgroundColor:'red'}}><Text>signup </Text></TouchableOpacity>
                 <TouchableOpacity onPress={()=>this.signIn()} style={{height:30, width:60, backgroundColor:'red'}}><Text>LOgin </Text></TouchableOpacity>
                 <TouchableOpacity style={{height:30, width:60, backgroundColor:'green', marginTop:10}}><Text>Insert</Text></TouchableOpacity>
                 <TouchableOpacity onPress={()=>this.onLoadData()} style={{height:30, width:60, backgroundColor:'blue', marginTop:10}}><Text>load</Text></TouchableOpacity>
                 <TouchableOpacity onPress={()=>this.onLoadProData()} style={{height:30, width:60, backgroundColor:'blue', marginTop:10}}><Text>load Profile</Text></TouchableOpacity>
                 <TouchableOpacity onPress={()=>this.onCreateProfile()} style={{height:30, width:60, backgroundColor:'blue', marginTop:10}}><Text>create Profile</Text></TouchableOpacity>
             </View>
        );
    }
 
}

export default Home;
