// Function to generate the HTML structure
function generateDepBox(id, busName, attention, timetodep, time, displayAttention, displayDelay, delay) {
    // Create the main div element with id and class
    const depBox = document.createElement('div');
    depBox.id = `dep-${id}`;
    depBox.className = 'dep-box';
  
    // Create the bus name heading element with id and class
    const busNameHeading = document.createElement('h3');
    busNameHeading.id = `bus-name-${id}`;
    busNameHeading.className = 'bus-name';
    busNameHeading.textContent = busName;
  
    // Create the attention box div element with class
    const attentionBox = document.createElement('div');
    attentionBox.className = 'attention-box';
  
    // Create the warning icon element with class
    const warningIcon = document.createElement('i');
    warningIcon.className = `warning warning-${id} fas fa-exclamation-triangle`;
  
    // Create the attention heading element with id
    const attentionHeading = document.createElement('h6');
    attentionHeading.id = `attention-${id}`;
    attentionHeading.textContent = attention;
  
    // Append the warning icon and attention heading to the attention box
    attentionBox.appendChild(warningIcon);
    attentionBox.appendChild(attentionHeading);
    if (!displayAttention) {
        attentionBox.style.display = 'none';
    }
  
    // Create the time box div element with class
    const timeBox = document.createElement('div');
    timeBox.className = 'time-box';
  
    // Create the timetodep heading element with id
    const timetodepHeading = document.createElement('h2');
    timetodepHeading.id = `timetodep-${id}`;
    timetodepHeading.textContent = `${timetodep}'`;
  
    // Create the time heading element with id
    const timeHeading = displayDelay ? document.createElement('h4') : document.createElement('h3') ;
    timeHeading.id = `time-${id}`;
    timeHeading.textContent = displayDelay ? time + " +" + delay +"'" : time;
    if(!displayDelay)
    {
        timetodepHeading.style.color = '#ddffdd';
    }
    else{
        timetodepHeading.style.color = '#ff6868';
    }
  
    // Append the timetodep and time headings to the time box
    timeBox.appendChild(timetodepHeading);
    timeBox.appendChild(timeHeading);
  
    // Append the bus name, attention box, and time box to the main div
    depBox.appendChild(busNameHeading);
    depBox.appendChild(attentionBox);
    depBox.appendChild(timeBox);
  
    // Return the generated HTML structure
    return depBox;
  }  
  

// Function to make a GET request and process the response
function getData() {
    // URL to make the GET request
    const now_ = new Date();
    const url = 'https://fpbe.zvv.ch/restproxy/departureBoard?format=json&accessId=OFPubique&type=DEP_STATION&duration=1439&id=A%3D1%40O%3DZ%C3%BCrich,+Holzerhurd%40X%3D8496613%40Y%3D47423797%40U%3D87%40L%3D8591200%40B%3D1%40p%3D1683641194%40&date='+now_.getFullYear()+'-'+(((now_.getMonth()+1)<10?'0':'')+(now_.getMonth()+1))+'-'+((now_.getDate()<10?'0':'')+now_.getDate())+'&time='+((now_.getHours()<10?'0':'')+now_.getHours())+':'+((now_.getMinutes()<10?'0':'')+now_.getMinutes())+'&passlist=1&maxJourneys=6';
  
    // Make the GET request
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('sbb-box');
        container.innerHTML = '';

        const deps = data.Departure;

        let i = 0;
        deps.forEach(dep => {

            const rttime_ = dep.rtTime ? dep.rtTime : dep.time;
            const dest_ = dep.direction;
            const time_ = dep.time;
    
            // Create and append text elements for each day entry
            //createTextElement(container, `B32 ${dest_ == "Zürich, Strassenverkehrsamt"?'':dest_} ${time_}`);
            
            const currentTime = new Date();
            const [hours, minutes, seconds] = time_.split(':');
            const specifiedTime = new Date();
            specifiedTime.setHours(hours);
            specifiedTime.setMinutes(minutes);
            specifiedTime.setSeconds(seconds);
            
            const [rthours, rtminutes, rtseconds] = rttime_.split(':');
            const rtstime = new Date();
            rtstime.setHours(rthours);
            rtstime.setMinutes(rtminutes);
            rtstime.setSeconds(rtseconds);
            const rtdiff = Math.floor((rtstime - specifiedTime) / (1000 * 60));

            const timeDiff = Math.floor((rtstime - currentTime) / (1000 * 60));

            console.log(rtdiff);

            const generatedHtml = generateDepBox(i, 'B32', dest_, timeDiff, hours+':'+minutes, dest_ != "Zürich, Strassenverkehrsamt", rtdiff != 0, rtdiff);
            container.appendChild(generatedHtml);

            i++;
        });
        
        /*
        // Process the JSON response
        const currentTemperature = data.data.current.temperature;
        const forecast = data.data.forecasts[0];
        const weekday = forecast.weekday;
        const tempLow = forecast.temp_low;
        const tempHigh = forecast.temp_high;
  
        // Display the values in HTML elements
        document.getElementById('current').textContent = currentTemperature;
        document.getElementById('name').textContent = weekday;
        document.getElementById('low').textContent = tempLow;
        document.getElementById('high').textContent = tempHigh;
        // ...
        */
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
  
  // Call the function to retrieve data and display it
  getData();
  
  //call every 10sec
  setInterval(getData, 50000);