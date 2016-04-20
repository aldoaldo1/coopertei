F.doNothing = function() {
};

F.log = function(x) {
  if (console) {
    console.log(x);
  } else {
    alert(x);
  }
};

F.objectSize = function(obj) {
    var size = 0, key;

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        size++;
      }
    }

    return size;
};

F.concatObjects = function jsonConcat(o1, o2) {
  for (var key in o2) {
    o1[key] = o2[key];
  }

  return o1;
};

F.JSONValuesToArray = function(obj) {
  var arr = [];

  _.each(obj, function(value, key) {
    arr.push(value);
  });

  return arr;
};

F.flipDateMonth = function(date) {
  var x = date.substr(0, 10);
  return x[3]+x[4]+x[5]+x[0]+x[1]+x[2]+x[6]+x[7]+x[8]+x[9] + date.substr(10, date.length);
};

F.toHumanDate = function(mysqldate, show_time) {
  if (mysqldate === null) {
    return null;
  }

  var x = new Date(mysqldate),
      date = '';

  x.setHours(x.getHours() + 3); // GMT correction

  date += (x.getDate() < 10 ? '0' : '') + x.getDate();
  date += '/';
  date += ((x.getMonth()+1) < 10 ? '0' : '') + (x.getMonth()+1);
  date += '/';
  date += x.getFullYear();

  if (show_time === undefined && show_time === true) {
    date += ' ';
    date += (x.getHours() < 10 ? '0' : '') + x.getHours();
    date += ':';
    date += (x.getMinutes() < 10 ? '0' : '') + x.getMinutes();
    date += ':';
    date += (x.getSeconds() < 10 ? '0' : '') + x.getSeconds();
  }

  return date;
};

F.capitalize = function(x) {
  return x.charAt(0).toUpperCase() + x.substr(1);
};

// jQuery extensions (DataTables too)

$.fn.serializeObject = function() {
  var o = {}, a = this.serializeArray();

  $.each(a, function() {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });

  return o;
};

$.fn.getFields = function() {
  return $(this).find('input:text, input:checkbox, textarea, select');
};

$.fn.dataTableExt.oSort['es_date-asc'] = function(a, b) {
  var x = new Date(a), y = new Date(b);
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
};

$.fn.dataTableExt.oSort['es_date-desc'] = function(a, b) {
  var x = new Date(a), y = new Date(b);
  return ((x < y) ? 1 : ((x > y) ? -1 : 0));
};

$.fn.dataTableExt.oApi.fnAddDataAndDisplay = function(oSettings, aData) {
  /* Add the data */
  var iAdded = this.oApi._fnAddData( oSettings, aData );
  var nAdded = oSettings.aoData[ iAdded ].nTr;

  /* Need to re-filter and re-sort the table to get positioning correct, not perfect
   * as this will actually redraw the table on screen, but the update should be so fast (and
   * possibly not alter what is already on display) that the user will not notice
   */
  this.oApi._fnReDraw(oSettings);

  /* Find it's position in the table */
  var iPos = -1;

  for (var i = 0, iLen = oSettings.aiDisplay.length; i < iLen; i++) {
    if (oSettings.aoData[oSettings.aiDisplay[i]].nTr == nAdded) {
      iPos = i;
      break;
    }
  }

  /* Get starting point, taking account of paging */
  if (iPos >= 0) {
    oSettings._iDisplayStart = ( Math.floor(i / oSettings._iDisplayLength) ) * oSettings._iDisplayLength;
    this.oApi._fnCalculateEnd( oSettings );
  }

  this.oApi._fnDraw(oSettings);

  return {
    "nTr": nAdded,
    "iPos": iAdded
  };
};


// AJAX

F.onSuccess = function(response, ok, notok) {
  var result = JSON.parse(response);

  if (result === true) {
    ok(result);
  } else {
    notok(result);
  }
};

F.getAllFromModel = function(model, fn) {
  $.ajax({
    url: '/' + model,
    success: function(data) {
      fn(data);
    }
  });
};

F.getOneFromModel = function(model, id, fn) {
  $.ajax({
    url: '/' + model + '/' + id,
    success: function(data) {
      fn(data);
    }
  });
};

F.getNextOtNumber = function(fn) {
  $.ajax({
    url: '/ot/next',
    success: function(data) {
      fn(data);
    }
  });
};

// DataTables

F.getDataTableSelection = function(tableNode) {
	var arr = [],
      nodes = $(tableNode).dataTable().fnGetNodes();

	for (var i = 0; i < nodes.length; i += 1) {
		if ($(nodes[i]).hasClass('selected_row')) {
			arr.push(nodes[i]);
		}
	}

	return arr;
};
