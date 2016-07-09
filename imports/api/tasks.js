import {Mongo} from 'meteor/mongo';

import {Meteor} from 'meteor/meteor';

import {check} from 'meteor/check';

export const Tasks=new Mongo.Collection('tasks');

if(Meteor.isServer){
	//only run server
	Meteor.publish('tasks',function tasksPublication(){
		return Tasks.find({
			$or:[
			{private:{$ne:true}},
			{owner:this.userId},
			],
		});
	});
}

Meteor.methods({
	'tasks.insert'(text){
		//检查输入的内容
		check(text,String);
		//确定用户已经登陆
		if(! this.userId){
			throw new Meteor.Error('not-authorized');
		};
		Tasks.insert({
			text,
			createAt:new Date(),
			owner:this.userId,
			username:Meteor.users.findOne(this.userId).username,
		});
	},
	'tasks.remove'(taskId){
		// if(! this.userId){
		// 	throw new Meteor.Error('not-authorized');
		// };
		check(taskId,String);
		const task =Tasks.findOne(taskId);
		if(task.private&&task.owner!==this.userId){
			throw new Meteor.Error('not-authorized');
		}
		Tasks.remove(taskId);
	},
	'tasks.setChecked'(taskId,setChecked){
		check(taskId,String);
		check(setChecked,Boolean);
		Tasks.update(taskId,{$set:{checked:setChecked}});
	},
	'tasks.setPrivate'(taskId,setToPrivate){
		check(taskId,String);
		check(setToPrivate,Boolean);
		const task=Tasks.findOne(taskId);
		if(task.owner!==this.userId){
			throw new Meteor.Error('not-authorized');
		}
		Tasks.update(taskId,{$set:{private:setToPrivate}});
	},
});

