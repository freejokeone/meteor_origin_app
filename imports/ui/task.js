import {Template} from 'meteor/templating';

import {Meteor} from 'meteor/meteor';

import {Tasks} from '../api/tasks.js';

import './task.html';

Template.task.helpers({
	isOwner(){
		return this.owner===Meteor.userId();
	},
});

Template.task.events({
	//复选框选中
	'click .toggle-checked'(){
		// Tasks.update(this._id,{
		// 	$set:{checked:!this.checked},
		// });
		Meteor.call('tasks.setChecked',this._id,!this.checked);
	},
	//删除操作
	'click .delete'(){
		Meteor.call('tasks.remove',this._id);
	},
	'click .toggle-private'(){
		Meteor.call('tasks.setPrivate',this._id,!this.private);
	},
});
