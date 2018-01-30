/**
 * Class setup to determine whether the page is dirty or not
 *
 * @license MIT
 * @version 1.0.1
 * @author Izzy Skye https://github.com/zeraphie/dirtify
 */
export default class Dirtify {
    /**
     * Constructor for the class
     */
    constructor(
        inputEvents = this.constructor.DEFAULT_INPUT_EVENTS,
        inputElements = this.constructor.DEFAULT_INPUT_ELEMENTS,
        
        submitEvents = this.constructor.DEFAULT_SUBMIT_EVENTS,
        
        ignoreAttribute = this.constructor.DEFAULT_IGNORE_ATTRIBUTE,
        stopMessage = this.constructor.DEFAULT_STOP_MESSAGE
    ){
        this.dirty = false;
        this.inputs = [];
        
        this.inputEvents = inputEvents;
        this.inputElements = inputElements;
        
        this.submitEvents = submitEvents;
        
        this.ignoreAttribute = ignoreAttribute;
        this.stopMessage = stopMessage;
        
        this.onBeforeUnload = this.onBeforeUnload.bind(this);
    }
    
    /**
     * All the input events
     *
     * @return {[*]} DEFAULT_INPUT_EVENTS Input events
     */
    static get DEFAULT_INPUT_EVENTS(){
        return ['keyup', 'change'];
    }
    
    /**
     * All the input element tagnames
     *
     * @return {[*]} DEFAULT_INPUT_ELEMENTS Input element tagnames
     */
    static get DEFAULT_INPUT_ELEMENTS(){
        return ['input', 'textarea', 'select'];
    }
    
    /**
     * All the submit events
     *
     * @return {[*]} DEFAULT_SUBMIT_EVENTS Submit events
     */
    static get DEFAULT_SUBMIT_EVENTS(){
        return ['submit'];
    }
    
    /**
     * The attribute added to elements to be ignored
     *
     * @return string DEFAULT_IGNORE_ATTRIBUTE Ignored attribute
     */
    static get DEFAULT_IGNORE_ATTRIBUTE(){
        return 'data-ignore-dirty';
    }
    
    /**
     * The stop message sent on navigating away
     *
     * @returns {string}
     */
    static get DEFAULT_STOP_MESSAGE(){
        return "Leaving this page will result in losing unsaved changes,"
            + " do you wish to continue";
    }
    
    /**
     * Recursively go up through the dom until a match is found
     *
     * @param child DOM Element
     * @param parentIdentifier tag, class, id
     * @returns {*}
     */
    static closest(child, parentIdentifier){
        while(child.parentNode){
            child = child.parentNode;
            
            if(
                child.tagName === parentIdentifier
                ||
                child.classList.contains(parentIdentifier)
                ||
                child.getAttribute('id') === parentIdentifier
            ){
                return child;
            }
        }
        
        return null;
    }
    
    /**
     * The event handler for the onbeforeunload event
     *
     * @param e
     * @returns {string|*}
     */
    onBeforeUnload(e){
        // Newer browsers no longer support the message, but no harm in
        // keeping one just in case
        if(this.dirty){
            e.returnValue = this.stopMessage;
            return this.stopMessage;
        }
    }
    
    /**
     * Bind the onbeforeunload event listener to the window object
     *
     * @return {Dirtify}
     */
    bindBeforeUnload(){
        // This event fires just before navigating away and then displays a
        // prompt depending on whether or not the page is 'dirty'
        window.addEventListener('beforeunload', this.onBeforeUnload);
        
        return this;
    }
    
    /**
     * Unbind the onbeforeunload event listener
     *
     * @returns {Dirtify}
     */
    unbindBeforeUnload(){
        if(typeof window.onbeforeunload === 'function'){
            window.onbeforeunload = null;
        }
        
        return this;
    }
    
    /**
     * Setup the tests on the inputs to see if the page is dirty or not
     *
     * @return {Dirtify}
     */
    filterInputs(){
        // Get all fields which can be changed
        this.inputElements.forEach(element => {
            // For each element matched
            document.querySelectorAll(element).forEach(element => {
                // Ignore any element that has the attribute of
                // data-ignore-dirty
                if(element.hasAttribute(this.ignoreAttribute)){
                    return;
                }
                
                // Store the original value with a reference
                let original = {
                    original: element.value,
                    dirty: false
                };
                
                this.inputs.push(original);
                
                // On each change event for inputs
                this.inputEvents.forEach(event => {
                    element.addEventListener(event, e => {
                        // Test if the current value is not the same as the
                        // original And change dirty as required
                        original.dirty = e.target.value !== original.original;
                        
                        // Test if any input is dirty (check the length of the
                        // filtered array and convert it into a boolean value)
                        this.dirty = !!this.inputs
                            .filter(input => input.dirty)
                            .length;
                    }, false);
                });
            });
            
            // Get the corresponding form element and unbind the before unload
            // on submit
            let form = this.constructor.closest(element, 'form');
            if(form){
                this.submitEvents.forEach(event => {
                    form.addEventListener(event, function(e){
                        this.unbindBeforeUnload();
                    });
                });
            }
        });
        
        return this;
    }
    
    /**
     * Helper function to setup the class with relevant methods
     *
     * @return {Dirtify}
     */
    setup(){
        return this.bindBeforeUnload()
            .filterInputs();
    }
}
