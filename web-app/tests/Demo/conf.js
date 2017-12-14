// To run the tests :
// sudo webdriver-manager start    ** TO START A SELENIUM SERVER: CHROME IS DEFAULT **
// protractor conf.js

exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        '1_Connection_creation_de_projet.spec.js',
        '2_Ajouter_PO.spec.js',
        '3_Ajouter_2US.spec.js',
        '4_PO_Modify_Priority.spec.js',
        '5_Ajouter_sprint.spec.js',
        '6_Ajouter_US_a_Sprint.spec.js',
        '7_Ajouter_Tache_a_sprint.spec.js'
    ]

}
