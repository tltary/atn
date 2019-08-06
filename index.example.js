const asana = require('./lib/asana-api');
const fetch = require('node-fetch');

const apKey = '<your-access-token>';

const apDesk = '<desk-gid>';

fetch(
	`https://app.asana.com/api/1.0/projects/${apDesk}/tasks`, 
	{
		method: 'GET',
		headers:{
	    'Content-Type': 'application/json',
	    'Authorization': `Bearer ${apKey}`
	  }
	})
  	.then(function(response) {
  		//console.log(response.json())
    	return response.json();
  	})
  	.then(function(myJson) {
  		let data = myJson.data;
  		let taskNum = data.map(function(el) {
			if (el.name.match(/^<your-prefix>/gm)) {
  				return el;
  			}
		});
		let taskNotNum = data.map(function(el) {
			if (!el.name.match(/^<your-prefix>/gm)) {
  				return el;
  			}
		});

		taskNum = taskNum.filter(element => element !== undefined);
		taskNotNum = taskNotNum.filter(element => element !== undefined);

		let taskCount = taskNum.map(function(el) {
			el = el.name.replace(/ .*/gm,'').replace('<your-prefix>','')
  			return parseInt(el);
		});

		taskCount.sort(function(a,b){ 
  			return b - a
		})

		let lastCount = taskCount[0];
		
		for (key in taskNotNum) {
			lastCount = lastCount + 1;
			fetch(
				`https://app.asana.com/api/1.0/tasks/${taskNotNum[key].gid}`,
				{
					method: 'PUT',
					headers:{
				    	'Content-Type': 'application/json',
				    	'Authorization': `Bearer ${apKey}`
				  	},
				  	body: JSON.stringify({'data' : {'name' : `<your-prefix>-${lastCount} ${taskNotNum[key].name}`}}),
				})
			.then(function(response) {
				return response.json();
		  	})
		  	.then(function(myJson) {
		  		console.dir(JSON.stringify(myJson))
		  	})
		}
  	});