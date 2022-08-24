/**
 * A selection of multiple values on a slider.
 * @constructor
 * @param {number} min The minimum value of the slider.
 * @param {number} max The maximum value of the slider.
 * @param {number} value1 The initial value1 of the slider.
 * @param {number} value2 The initial value2 of the slider.
 * @param {Array[string]} labels The labels for the slider.
 * @param {number} step The step size of the slider.
 * @param {Array[string]} all_labels The labels of all the data for use with the tooltip.
 */
class MultiSlider{
    constructor(container, min = 0, max = 10, value1 = 2, value2 = 8, labels = null, step = 1, all_labels = null){
        this.container_id = container;
        this.container = document.createElement('div');
        this.container.classList = "time-picker-container";
        this.min = min;
        this.max = max - 1;
        this.labels = labels == null ? [] : labels;
        this.step = step;
        this.initialValue1 = value1;
        this.initialValue2 = value2;
        this.all_labels = all_labels;
        this.tooltip = document.createElement('div');
        this.init();
    }

    /**
     * Initialize the slider.
    */
    init(){
        this.initElements();
        this.createSlider();
        this.createTicks();
        this.createHandles();
        this.createEvents();

        this.computePosition(this.initialValue1, this.handle1);
        this.computePosition(this.initialValue2, this.handle2);
        this.update();
        
    }

    /**
     * Initialize the elements.
    */
    initElements(){
        document.querySelector(this.container_id).appendChild(this.container);
        document.querySelector(this.container_id).classList.add('time-picker');
        this.initTooltip();
    }


    /**
     * Initialize the slider and its elements.
    */
    createSlider(){
        this.slider = document.createElement('div');
        this.slider.classList.add('slider');
        this.container.appendChild(this.slider);
    }

    /**
     * Initialize the handles.
     * init the handle1 and handle2.
     * init the connecting line.
    */
    createHandles(){
        this.handle1 = document.createElement('span');
        this.handle1.classList.add('handle');
        this.handle1.classList.add('handle1');
        this.handle1.setAttribute('value', this.value1);
        this.slider.appendChild(this.handle1);

        this.handle2 = document.createElement('span');
        this.handle2.classList.add('handle');
        this.handle2.classList.add('handle2');
        this.handle2.setAttribute('value', this.value2);
        this.slider.appendChild(this.handle2);

        this.connector = document.createElement('span');
        this.connector.classList.add('connector');
        this.slider.appendChild(this.connector);

        this.min_max_input = document.createElement('input');
        this.min_max_input.classList.add('min-max');
        this.min_max_input.setAttribute('hidden', true);
        this.min_max_input.id = this.container_id + "-min-max";
        this.min_max_input.setAttribute('value', this.value1 + "-" + this.value2);
        this.slider.appendChild(this.min_max_input);
    }

    /**
     * Initialize the ticks with labels if applicable.
    */
    createTicks(){
        this.ticks_container = document.createElement('div');
        this.ticks_container.classList.add('ticks-container');
        
        for(let i = 0; i <= this.max + 1 - this.min; i+=this.step){
            let tick = document.createElement('div');
            tick.classList.add('tick');
            this.ticks_container.appendChild(tick);

            if(i % this.label_step_count == 0){
                tick.innerText = this.labels[Math.round(i / this.label_step_count)] || "";
            }
        }

        this.container.appendChild(this.ticks_container);
    }

    /**
     * Initialize the tooltip by adding a class to it 
    */
    initTooltip(){
        this.tooltip.classList.add('tooltip');
    }

    /**
     * Insert the tooltip into the DOM
     * @param {HTMLElement} handle The handle to insert the tooltip into.
    */
    insertTooltip(handle){
        handle.appendChild(this.tooltip);
    }

    /**
     * Remove the tooltip from the DOM
     * @param {HTMLElement} handle The handle to remove the tooltip from.
    */
    removeTooltip(handle){
        handle.removeChild(this.tooltip);
    }

    /**
     * Register the DOM events.
     */
    createEvents(){
        this.handle1.addEventListener('mousedown', (e) => {
            this.startDragging(this.handle1, e);
        });
        this.handle2.addEventListener('mousedown', (e) => {
            this.startDragging(this.handle2, e);
        });
        
        document.addEventListener('mouseup', (e) => {
            if(this.dragging){
                this.stopDragging(e);
            }
        });

        window.addEventListener('resize', (e) => {
            this.computePosition(this.value1, this.handle1);
            this.computePosition(this.value2, this.handle2);
            this.update();
        });
    }

    /**
     * The function to call when the user starts dragging a handle.
     * @param {HTMLElement} handle The handle that is being dragged.
     * @param {MouseEvent} e The mouse event.
    */
    startDragging(handle, e){
        this.dragging = true;
        this.dragging_handle = handle;
        this.dragging_handle.classList.add('active');
        this.insertTooltip(this.dragging_handle);

        if(this.computeInterval){
            clearInterval(this.computeInterval);
        }

        this.computeInterval = setInterval(() => {
            let value = this.calculateValue(this.dragging_handle)
            this.dragging_handle.setAttribute('value', value);

            if(this.all_labels[value - this.min] != undefined){
                this.tooltip.innerText = this.all_labels[value - this.min];
            }else{
                this.tooltip.innerText = value - this.min;
            }

            this.computePosition(value, this.dragging_handle);
            this.update();
        } , 50);

        document.addEventListener('mousemove', (e) => {
            this.setPosition(e);
        });
    }

    /**
     * The function to call when the user stops dragging a handle.
     * @param {MouseEvent} e The mouse event.
    */
    stopDragging(e){
        this.dragging = false;
        this.dragging_handle.classList.remove('active');
        clearInterval(this.computeInterval);
        this.removeTooltip(this.dragging_handle);
        document.removeEventListener('mousemove', (e) => {
            this.setPosition(e);
        });
    }

    /**
     * calculates the value of the handle based on the position of the mouse
     * @param {HTMLElement} handle The handle to calculate the value for.
     * @returns {Number} The value of the handle.
     */
    calculateValue(handle){
        let mouseX = this.mouseX
        if(this.mouseX == undefined){
            mouseX = handle.getBoundingClientRect().left + (handle.getBoundingClientRect().width / 2);
        }

        let sliderX = this.slider.getBoundingClientRect().left;
        let sliderWidth = this.slider.getBoundingClientRect().width;
        let handleWidth = this.handle1.offsetWidth;

        let value = Math.round(((mouseX - sliderX) / (sliderWidth)) * this.step_count) + this.min;
        value = Math.max(value, this.min);
        value = Math.min(value, this.max + 1);
        return value;
    }

    /**
     * Sets the position of the handle based on the mouse position.
     * @param {int} value The value to calculate the position for.
     * @param {HTMLElement} handle The handle to calculate the position for.
     */
    computePosition(value = undefined, handle = undefined){
        value = parseInt(value);
        let sliderX = this.slider.getBoundingClientRect().left;
        let sliderWidth = this.slider.getBoundingClientRect().width;
        let handleWidth = this.handle1.offsetWidth;
        
        if(value < this.min){
            value = this.min;
        }

        if(value > this.max + 1){
            value = this.max + 1;
        }

        let handleX = Math.round((sliderWidth / this.step_count) * (value - this.min)) - (handleWidth / 2);
        
        handle.style.left = handleX + 'px'
    }

    /**
     * Updates some of the rendering of the slider, handles, and connector.
     * @param {MouseEvent} e The mouse event.
     */
    update(e){
        let h1_pos = Math.max(0, this.handle1.getBoundingClientRect().left - this.slider.getBoundingClientRect().left);
        let h2_pos = Math.max(0, this.handle2.getBoundingClientRect().left - this.slider.getBoundingClientRect().left);
        if(h1_pos > h2_pos){
            let temp = h1_pos
            h1_pos = h2_pos;
            h2_pos = temp;
        }
        let width = Math.abs(h1_pos - h2_pos);
        let h1_width = this.handle1.getBoundingClientRect().width;
        this.connector.style.left = h1_pos + (h1_width / 2) - 1 + 'px';
        this.connector.style.width = width + 'px';

        this.container.setAttribute('min', Math.min(this.value1, this.value2));
        this.container.setAttribute('max', Math.max(this.value1, this.value2));

        this.min_max_input.setAttribute('value', this.container.getAttribute('min') + '-' + this.container.getAttribute('max'));
    }

    /**
     * Sets internal variables based on the mouse position.
     * @param {MouseEvent} e The mouse event.
     */
    setPosition(e){
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    /**
     * A getter for the number of steps in the slider.
     * @returns {Number} The number of steps in the slider.
     */
    get step_count(){
        return Math.floor(((this.max - this.min) + 1) / this.step);
    }

    /**
     * A getter for the amount of steps needing labels
     * @returns {Number} The amount of steps needing labels.
     */
    get label_step_count(){
        return Math.round(this.step_count / (this.labels.length - 1));
    }

    /**
     * A getter for the value of the first handle.
     * @returns {Number} The value of the first handle.
    */
    get value1(){
        return this.handle1.getAttribute('value') || this.initialValue1;
    }

    /**
     * A getter for the value of the second handle.
     * @returns {Number} The value of the second handle.
    */
    get value2(){
        return this.handle2.getAttribute('value') || this.initialValue2;
    }
}