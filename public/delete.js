// CS340 Project
// Section    : 401
// Team Member: Alice Li & Chang Li

function deletePerson(id){
    $.ajax({
        url: '/students/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteClass(id){
  $.ajax({
      url: '/classes/' + id,
      type: 'DELETE',
      success: function(result){
          window.location.reload(true);
      }
  })
};

function deleteExam(id){
  $.ajax({
      url: '/exams/' + id,
      type: 'DELETE',
      success: function(result){
          window.location.reload(true);
      }
  })
};

function deleteTeacher(id){
  $.ajax({
      url: '/teachers/' + id,
      type: 'DELETE',
      success: function(result){
          window.location.reload(true);
      }
  })
};

function deleteOffice(id){
  $.ajax({
      url: '/offices/' + id,
      type: 'DELETE',
      success: function(result){
          window.location.reload(true);
      }
  })
};


function deleteEnroll(sid, cid){
  $.ajax({
      url: '/classstudents/sid/' + sid + '/cid/' + cid,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true);
          } 
      }
  })
};
