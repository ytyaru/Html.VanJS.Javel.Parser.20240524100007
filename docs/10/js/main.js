window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const app = new JavelWriter()
//    app.init()

    const client = new ClientJS();
    const fingerprint = client.getFingerprint();
    console.log(fingerprint);
    console.log(typeof fingerprint);
    /*
    new Fingerprint2().get(function(result, components){
        console.log(result); //a hash, representing your device fingerprint
        console.log(components); // an array of FP components
    });
    */
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

