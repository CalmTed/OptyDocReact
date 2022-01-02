import store from './store.js'


test('if store is valid', () => {
    console.log(store.getState())
    expect(store.getState()).toMatchObject({
        app:{},
        template:{}
    });
});