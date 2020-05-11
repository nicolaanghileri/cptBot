/**
 * Offers various operations to the json files containing students, teachers and modules.
 * 
 * @author Ismael Trentin
 * @version 2020.05.08
 */
class Jsonator {

    constructor(studentsPath, teachersPath, modulezPath) {
        this.studentsPath = studentsPath;
        this.teachersPath = teachersPath;
        this.modulezPath = modulezPath;
        this.logger = require('../util/Logger');
        this.fs = require('fs');
    }

    /**
     * Reads the json file jsonPath and returns it as an object.
     * 
     * @param {string | number | Buffer | URL} jsonPath the path of the json file wich to read from
     * @returns {object} the json as an object.
     */
    getJson(jsonPath) {
        let data = "" + this.fs.readFileSync(jsonPath);
        return JSON.parse(data);
    }

    /**
     * Adds a new student to the json file.
     * 
     * @param {string} name the student's name
     * @param {string} surname the student's surname
     * @param {Groups} group the student's group
     * @param {number} year the student's school year
     * @returns {object} the newly created student object.
     */
    async addStudent(name, surname, group, year) {
        return new Promise((resolve, reject) => {
            let student = {
                name: name,
                surname: surname,
                group: group,
                year: year
            };
            this.getJson(this.studentsPath)
                .then(json => {
                    let skip = false;
                    let students = json.students;
                    students.forEach(s => {
                        if (s.name == name && s.surname == surname && s.group == group) {
                            skip = true;
                            reject(`The student ${name} ${surname} in group ${group} already exists.`);
                        }
                    });
                    if (!skip) {
                        json.students.push(student);
                        let jsonData = JSON.stringify(json, null, "  ");
                        this.fs.writeFile(this.studentsPath, jsonData, function (err) {
                            if (err) throw err;
                        });
                        resolve(student);
                    }
                }).catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Adds a new teacher to the json file.
     * 
     * @param {sstring} name the teacher's name
     * @param {string} surname the teacher's surname
     * @returns {object} the newly created teacher object.
     */
    async addTeacher(name, surname) {
        return new Promise((resolve, reject) => {
            let teacher = {
                name: name,
                surname: surname,
            };
            this.getJson(this.teachersPath)
                .then(json => {
                    let skip = false;
                    let teachers = json.teachers;
                    teachers.forEach(t => {
                        if (t.name == name && t.surname == surname) {
                            skip = true;
                            reject(`The teacher ${name} ${surname} already exists.`);
                        }
                    });
                    if (!skip) {
                        json.teachers.push(teacher);
                        let jsonData = JSON.stringify(json, null, " ");
                        this.fs.writeFile(this.teachersPath, jsonData, function (err) {
                            if (err) throw err;
                        });
                        resolve(teacher);
                    }
                }).catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Adds a new module to the json file.
     * 
     * @param {string} name the name of the module
     * @param {number} year the school year where this module is teached.
     * @param {boolean} semestral defines if the module is 6 months long, true yes, false no
     * @param {object} teacher the teacher object
     * @returns {object} the newly created module object.
     */
    async addMod(name, year, semestral, teacher = {}) {
        let ts = await this.getTeachers();
        let valid = false;
        ts.forEach(t => {
            if (t.name.toLowerCase() == teacher.name.toLowerCase()
                && t.surname.toLowerCase() == teacher.surname.toLowerCase()) {
                valid = true;
            }
        });
        if (!valid)
            reject(`The teacher ${teacher.name} ${teacher.surname} does not exists.`);
        return new Promise((resolve, reject) => {
            let mod = {
                name: name,
                year: year,
                semestral: semestral,
                teacher: teacher
            };
            this.getJson(this.modulezPath)
                .then(json => {
                    let skip = false;
                    let modulez = json.modulez;
                    modulez.forEach(t => {
                        if (t.name == name) {
                            skip = true;
                            reject(`The module ${name} already exists.`);
                        }
                    });
                    if (!skip) {
                        json.modulez.push(mod);
                        let jsonData = JSON.stringify(json, null, " ");
                        this.fs.writeFile(this.modulezPath, jsonData, function (err) {
                            if (err) throw err;
                        });
                        resolve(mod);
                    }
                }).catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Adds a new module with the teacher teacherName teacherSurname to the json file.
     * 
     * @param {string} name the name of the module
     * @param {number} year the school year where this module is teached.
     * @param {boolean} semestral defines if the module is 6 months long, true yes, false no
     * @param {string} teacherName the teacher name
     * @param {string} teacherSurname the teacher surname
     * @returns {object} the newly created module object.
     */
    async addModN(name, year, semestral, teacherName, teacherSurname) {
        return new Promise((resolve, reject) => {
            this.getTeacher(teacherName, teacherSurname)
                .then(t => {
                    let mod = {
                        name: name,
                        year: year,
                        semestral: semestral,
                        teacher: t
                    };
                    this.getJson(this.modulezPath)
                        .then(json => {
                            let skip = false;
                            let modulez = json.modulez;
                            modulez.forEach(t => {
                                if (t.name == name) {
                                    skip = true;
                                    reject(`The module ${name} already exists.`);
                                }
                            });
                            if (!skip) {
                                json.modulez.push(mod);
                                let jsonData = JSON.stringify(json, null, " ");
                                this.fs.writeFile(this.modulezPath, jsonData, function (err) {
                                    if (err) throw err;
                                });
                                resolve(mod);
                            }
                        }).catch(err => {
                            reject(err);
                        });
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
    * Returns all the students.
    * 
    * @returns {object} all the saved students.
    */
    async getStudents() {
        return new Promise((resolve, reject) => {
            this.getJson(this.studentsPath)
                .then(json => {
                    resolve(json.students);
                }).catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Returns all the teachers.
     * 
     * @returns {object} all the saved teachers.
     */
    async getTeachers() {
        return new Promise((resolve, reject) => {
            this.getJson(this.teachersPath)
                .then(json => {
                    resolve(json.teachers);
                }).catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Returns all the modules.
     * 
     * @returns {object} all the saved modules.
     */
    async getMods() {
        return new Promise((resolve, reject) => {
            this.getJson(this.modulezPath)
                .then(json => {
                    resolve(json.modulez);
                }).catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Returns the corresponding student object.
     * 
     * @param {string} name the name of the student
     * @param {string} surname the surname of the student
     * @param {string} group the group of the student
     * @param {number} year the school year of the student
     * @returns {object} the corresponding student object.
     */
    async getStudent(name, surname, group, year) {
        name = name.toLowerCase();
        surname = surname.toLowerCase();
        group = group.toLowerCase();
        return new Promise((resolve, reject) => {
            this.getJson(this.studentsPath)
                .then(json => {
                    let students = json.students;
                    students.forEach(s => {
                        if (s.name.toLowerCase() == name && s.surname.toLowerCase() == surname
                            && s.group.toLowerCase() == group && s.year == year) {
                            resolve(s);
                        }
                    });
                    reject(`No student found for ${name} ${surname} ${group} ${year}`);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Returns the corresponding teacher object.
     * 
     * @param {string} name the teacher name
     * @param {string} surname the teacher surname
     * @returns {object} the corresponding teacher object.
     */
    async getTeacher(name, surname) {
        name = name.toLowerCase();
        surname = surname.toLowerCase();
        return new Promise((resolve, reject) => {
            let teachers = this.getJson(this.teachersPath).teachers;
            teachers.forEach(t => {
                if (t.name.toLowerCase() == name && t.surname.toLowerCase() == surname) {
                    resolve(t);
                }
            });
            reject(`No teacher found for ${name} ${surname}`);
        });
    }

    /**
     * Returs the corresponding module object.
     * 
     * @param {string} name the name of the module.
     */
    async getMod(name) {
        name = name.toLowerCase();
        return new Promise((resolve, reject) => {
            let modulez = this.getJson(this.modulezPath).modulez;
            modulez.forEach(m => {
                if (m.name.toLowerCase() == name) {
                    resolve(m);
                }
            });
            reject(`No module found for ${name}`);
        });
    }

    /**
     * Returns all the modules teached by the teacher teacherName teacherSurname.
     * 
     * @param {string} teacherName the teacher name
     * @param {string} teacherSurname the teacher surname
     */
    async getModsTeachedBy(teacherName, teacherSurname) {
        teacherName = teacherName.toLowerCase();
        teacherSurname = teacherSurname.toLowerCase();
        let mods = [];
        return new Promise((resolve, reject) => {
            this.getJson(this.modulezPath)
                .then(json => {
                    let modulez = json.modulez;
                    if (modulez.length == 0) {
                        reject(`No modules detected.`);
                    }
                    modulez.forEach(m => {
                        if (m.teacher.name.toLowerCase() == teacherName
                            && m.teacher.surname.toLowerCase() == teacherSurname) {
                            mods.push(m);
                        }
                    });
                    resolve(mods);
                }).catch(err => {
                    reject(err);
                });
        });
    }
}

module.exports = Jsonator;