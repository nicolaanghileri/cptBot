/**
 * Used for adding new students, teachers and modules tho the json files.
 * Needs to be initiated with the init method.
 * 
 * @author Ismael Trentin
 * @version 2020.05.07
 */
class Serializer {

    constructor(studentsPath, teachersPath, modulezPath) {
        this.studentsPath = studentsPath;
        this.teachersPath = teachersPath;
        this.modulezPath = modulezPath;
        this.logger = require('./../util/Logger');
        this.fs = require('fs');
    }

    /**
     * Adds a new student to the json file.
     * 
     * @param {string} name the student's name
     * @param {string} surname the student's surname
     * @param {Groups} group the student's group
     * @param {number} year the student's school year
     */
    async addStudent(name, surname, group, year) {
        let fss = this.fs;
        let sp = this.studentsPath;
        let log = this.logger;
        return new Promise((resolve, reject) => {
            let student = {
                name: name,
                surname: surname,
                group: group,
                year: year
            };
            this.fs.readFile(sp, function read(err, data) {
                if (err) {
                    throw err;
                }
                let content = data.toString();
                let obj = JSON.parse(content);
                //Check for duplicates
                let skip = false;
                let students = obj.students;
                students.forEach(s => {
                    if (s.name == name && s.surname == surname && s.group == group) {
                        log.log(`The student ${name} ${surname} in group ${group} already exists.`, log.categories.ERROR);
                        skip = true;
                        reject();
                    }
                });
                if (!skip) {
                    obj.students.push(student);
                    let jsonData = JSON.stringify(obj, null, "  ");
                    fss.writeFile(sp, jsonData, function (err) {
                        if (err) throw err;
                        log.log(`Added new student ${name} ${surname}.`, log.categories.SUCCESS);
                    });
                    resolve();
                }
            });
        });
    }

    /**
     * Adds a new teacher to the json file.
     * 
     * @param {sstring} name the teacher's name
     * @param {string} surname the teacher's surname
     */
    async addTeacher(name, surname) {
        let fss = this.fs;
        let tp = this.teachersPath;
        let log = this.logger;
        return new Promise((resolve, reject) => {
            let teacher = {
                name: name,
                surname: surname,
            };
            this.fs.readFile(tp, function read(err, data) {
                if (err) {
                    throw err;
                }
                let content = data.toString();
                let obj = JSON.parse(content);
                //Check for duplicates
                let skip = false;
                let teachers = obj.teachers;
                teachers.forEach(t => {
                    if (t.name == name && t.surname == surname) {
                        log.log(`The teacher ${name} ${surname} already exists.`, log.categories.ERROR);
                        skip = true;
                        reject();
                    }
                });

                if (!skip) {
                    obj.teachers.push(teacher);
                    let jsonData = JSON.stringify(obj, null, " ");
                    fss.writeFile(tp, jsonData, function (err) {
                        if (err) throw err;
                        log.log(`Added new teacher ${name} ${surname}.`, log.categories.SUCCESS);
                    });
                    resolve();
                }
            });
        });
    }
}

module.exports = Serializer;