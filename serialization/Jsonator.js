/**
 * Offers various operations to the json files containing students, teachers, 
 * modules and timetables.
 * 
 * @author Ismael Trentin
 * @version 2020.05.20
 */
class Jsonator {

    /**
     * Instantiates a new Jsonator object.
     * 
     * @param {string} studentsPath the path to the students json file
     * @param {string} teachersPath the path to the teachers json file
     * @param {string} modulezPath the path to the modulez json file
     * @param {string} timeTablesDirectory the path to the timetables directory
     */
    constructor(studentsPath, teachersPath, modulezPath, timeTablesDirectory) {
        this.studentsPath = studentsPath;
        this.teachersPath = teachersPath;
        this.modulezPath = modulezPath;
        this.timeTablesDirectory = timeTablesDirectory;
        this.fs = require('fs');
    }



    /**
     * Reads the json file jsonPath and returns it as a javascript object.
     * 
     * @param {string | number | Buffer | URL} jsonPath the path of the json file wich to read from
     * @returns {object} the json as an object.
     */
    async getJson(jsonPath) {
        return new Promise((resolve, reject) => {
            let data = "" + this.fs.readFileSync(jsonPath);
            if (data)
                resolve(JSON.parse(data));
            else
                reject('IO error');
            return;
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
                    return;
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
                    return;
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
                    return;
                }).catch(err => {
                    reject(err);
                    return;
                });
        });
    }

    /**
     * Returns the groups names.
     */
    getGroups() {
        return this.fs.readdirSync(this.timeTablesDirectory, 'utf-8', false)
            .map(n => n.replace('.json', ''));
    }

    /**
     * Returns all the classes for the group groupname.
     * 
     * @param {string} groupName the group name
     * @returns {Array} all the classes for the group groupname.
     */
    async getClassezFor(groupName) {
        return new Promise((resolve, reject) => {
            this.getJson((this.timeTablesDirectory + `${groupName.toLowerCase()}` + '.json'))
                .then(json => {
                    resolve(json.classez);
                    return;
                })
                .catch(() => {
                    reject(`No classes found for: ${groupName}`);
                    return;
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
                    json.students.forEach(s => {
                        if (s.name.toLowerCase() == name && s.surname.toLowerCase() == surname
                            && s.group.toLowerCase() == group && s.year == year) {
                            resolve(s);
                        }
                    });
                    reject(`No student found for ${name} ${surname} ${group} ${year}`);
                    return;
                })
                .catch(err => {
                    reject(err);
                    return;
                });
        });
    }

    async getStudent(clientId) {
        return new Promise((resolve, reject) => {
            this.getJson(this.studentsPath)
                .then(json => {
                    json.students.forEach(s => {
                        if (s.client_id === clientId) {
                            resolve(s);
                            return;
                        }

                    });
                    reject(`No student found with id ${clientId}.`);
                    return;
                })
                .catch(err => {
                    reject(err);
                    return;
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
            return;
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
            return;
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
                        return;
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
                    return;
                });
        });
    }

    /**
     * Returns the last class of the timetable for the group groupName.
     * 
     * @param {string} groupName the name of the group
     */
    async getLastClassFor(groupName) {
        let latestClazz;
        return new Promise((resolve, reject) => {
            this.getClassezFor(groupName)
                .then(cs => {
                    latestClazz = cs[0];
                    cs.forEach(c => {
                        if (c.start.h > latestClazz.start.h && c.start.m > latestClazz.start.m) {
                            latestClazz = c;
                        }
                    });
                    resolve(latestClazz);
                })
                .catch(err => {
                    reject(err);
                    return;
                });
        });
    }

    /**
     * Returns true if the time ranges overlap.
     * 
     * @param {Object} start1 the first start time object
     * @param {number} start1.h the hours of the time object
     * @param {number} start1.m the minutes of the time object
     * 
     * @param {Object} end1 the first end time object
     * @param {number} end1.h the hours of the time object
     * @param {number} end1.m the minutes of the time object
     * 
     * @param {Object} start2 the second start time object
     * @param {number} start2.h the hours of the time object
     * @param {number} start2.m the minutes of the time object
     * 
     * @param {Object} end2 the second end time object
     * @param {number} end2.h the hours of the time object
     * @param {number} end2.m the minutes of the time object
     */
    overlaps(start1, end1, start2, end2) {
        return (start1.h <= end2.h) && (end1.h >= start2.h)
            && (start1.m <= end2.m) && (end1.m >= start2.m);
    }

    isSameClazz(c1, c2) {
        for (let e in c1) {
            if (c1[e] != c2[e])
                return false;
        }
        for (let e in c1.start) {
            if (c1.start[e] != c2.start[e])
                return false;
        }
        for (let e in c1.end) {
            if (c1.end[e] != c2.end[e])
                return false;
        }
        return true;
    }

    /**
     * Adds a new student to the json file.
     * 
     * @param {string} name the student's name
     * @param {string} surname the student's surname
     * @param {Groups} group the student's group
     * @param {number} year the student's school year
     * @param {string} clientId the student's discord client id
     * @returns {object} the newly created student object.
     */
    async addStudent(name, surname, group, year, clientId) {
        return new Promise((resolve, reject) => {
            let student = {
                name: name,
                surname: surname,
                group: group,
                year: year,
                client_id: clientId
            };
            this.getJson(this.studentsPath)
                .then(json => {
                    let skip = false;
                    let students = json.students;
                    students.forEach(s => {
                        if (s.name == name && s.surname == surname && s.group == group) {
                            skip = true;
                            reject(`The student ${name} ${surname} in group ${group} already exists.`);
                            return;
                        } else if (s.client_id == clientId) {
                            skip = true;
                            reject(`A discord client already exists with the id ${clientId}`);
                            return;
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
                    return;
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
            let json = this.getJson(this.teachersPath)
                .then(json => {
                    let skip = false;
                    let teachers = json.teachers;
                    teachers.forEach(t => {
                        if (t.name == name && t.surname == surname) {
                            skip = true;
                            reject(`The teacher ${name} ${surname} already exists.`);
                            return;
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
                    return;
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
        if (!valid) {
            reject(`The teacher ${teacher.name} ${teacher.surname} does not exists.`);
            return;
        }
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
                            return;
                        }
                    });
                    if (!skip) {
                        json.modulez.push(mod);
                        let jsonData = JSON.stringify(json, null, " ");
                        this.fs.writeFile(this.modulezPath, jsonData, function (err) {
                            if (err) throw err;
                        });
                        resolve(mod);
                        return;
                    }
                }).catch(err => {
                    reject(err);
                    return;
                });
        });
    }

    /**
     * Adds a new class to the group groupName time table.
     * 
     * @param {string} groupName the name of the group
     * @param {Object} mod the module object
     * @param {Object} teacher the teacher object
     * @param {Object} startTime the start time object
     * @param {number} h the hours of the time object
     * @param {number} m the minutes of the time object
     * @param {Object} endTime the end time object
     * @param {number} h the hours of the time object
     * @param {number} m the minutes of the time object
     */
    async addClazz(groupName, mod, teacher, startTime, endTime) {
        return new Promise((resolve, reject) => {
            this.getJson((this.timeTablesDirectory + `${groupName.toLowerCase()}.json`))
                .then(json => {
                    let fullname = teacher.surname + ' ' + teacher.name;
                    let newClazz =
                    {
                        'name': mod.name,
                        'teacher_full_name': fullname,
                        start: startTime,
                        end: endTime
                    };
                    let c = json.classez;
                    for (let i = 0; i < c.length; i++) {
                        if (this.overlaps(newClazz.start, newClazz.end, c[i].start, c[i].end)) {
                            reject(`Cannot overlap other classes.`);
                            return;
                        }
                    }
                    json.classez.push(newClazz);
                    let jsonData = JSON.stringify(json, null, " ");
                    this.fs.writeFile(this.timeTablesDirectory + `${groupName.toLowerCase()}.json`, jsonData, function (err) {
                        if (err) throw err;
                    });
                    resolve(newClazz);
                    return;
                }).catch(err => {
                    reject(err);
                    return;
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
                                    return;
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
                            return;
                        });
                })
                .catch(err => {
                    reject(err);
                    return;
                });
        });
    }
}

module.exports = Jsonator;