
/**
 * @jest-environment jsdom
 */

function showToast(message) {
    const toastEl = document.getElementById('myToast');
    const toastBody = toastEl.querySelector('.toast-body');
    toastBody.textContent = message;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

describe('showToast', () => {
    let toastEl;
    let mockToastShow;

    beforeEach(() => {
        // Set up the DOM
        document.body.innerHTML = `
            <div id="myToast" class="toast">
                <div class="toast-body"></div>
            </div>
        `;

        toastEl = document.getElementById('myToast');
        mockToastShow = jest.fn(); // Mock the Toast show method

        // Mock bootstrap.Toast
        global.bootstrap = {
            Toast: jest.fn().mockImplementation(() => ({
                show: mockToastShow,
            })),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should display the correct message in the toast body and show the toast', () => {
        const message = 'Hello, world!';
        const showToast = (msg) => {
            const toastEl = document.getElementById('myToast');
            const toastBody = toastEl.querySelector('.toast-body');
            toastBody.textContent = msg;
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        };

        // Call the function
        showToast(message);

        // Assertions
        expect(toastEl.querySelector('.toast-body').textContent).toBe(message); // Check message
        expect(global.bootstrap.Toast).toHaveBeenCalledWith(toastEl); // Check Toast instance
        expect(mockToastShow).toHaveBeenCalled(); // Check show method called
    });
});
