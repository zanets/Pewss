export default class NewFileGenerator{

    static get(username){
        return `package ${username}.category; // modify category to scheduler || generator || platform || simulator`;
    }
}
