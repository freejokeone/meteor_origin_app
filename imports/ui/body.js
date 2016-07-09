import {Template} from 'meteor/templating';

import {Meteor} from 'meteor/meteor';

import {Tasks} from '../api/tasks.js';

import {ReactiveDict} from 'meteor/reactive-dict';

import './task.js';

import './body.html';

Template.body.onCreated(function bodyOnCreated(){
	this.state=new ReactiveDict();
	Meteor.subscribe('tasks');
});

Template.body.helpers({
	tasks(){
		const instance=Template.instance();
		if(instance.state.get('hideCompleted')){
			return Tasks.find({checked:{$ne:true}},{sort:{createdAt:-1}});
		}
		return Tasks.find({},{sort:{createAt:-1}});
	},
//task记录
	incompleteCount(){
		return Tasks.find({checked:{$ne:true}}).count();
	},
});

Template.body.events({
	//提交表单事件
	'submit .new-task':function(event){
		event.preventDefault();

		const target=event.target;
		const text=target.text.value;
		Meteor.call('tasks.insert',text);
		target.text.value="";
	},
	'change .hide-completed'(event,instance){
		instance.state.set('hideCompleted',event.target.checked);
	},

})