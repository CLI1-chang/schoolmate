// CS340 Project
// Section    : 401
// Team Member: Alice Li & Chang Li

function updatePerson(id){
    $.ajax({
        url: '/students/' + id,
        type: 'PUT',
        data: $('#update-student').serialize(),
        success: function(result){
            window.location.replace("../students");
        }
    })
};

function updateClass(id){
    $.ajax({
        url: '/classes/' + id,
        type: 'PUT',
        data: $('#update-class').serialize(),
        success: function(result){
            window.location.replace("../classes");
        }
    })
};

function updateTeacher(id){
    $.ajax({
        url: '/teachers/' + id,
        type: 'PUT',
        data: $('#update-teacher').serialize(),
        success: function(result){
            window.location.replace("../teachers");
        }
    })
};

function updateExam(id){
    $.ajax({
        url: '/exams/' + id,
        type: 'PUT',
        data: $('#update-exam').serialize(),
        success: function(result){
            window.location.replace("../exams");
        }
    })
};

function updateOffice(id){
    $.ajax({
        url: '/offices/' + id,
        type: 'PUT',
        data: $('#update-office').serialize(),
        success: function(result){
            window.location.replace("../offices");
        }
    })
};
