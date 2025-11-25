import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

// Cart reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }]
            };

        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };

        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };

        case 'CLEAR_CART':
            return {
                ...state,
                items: []
            };

        default:
            return state;
    }
};

export function CartProvider({ children }) {
    const [cart, dispatch] = useReducer(cartReducer, { items: [] });

    const addItem = (item) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const removeItem = (itemId) => {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeItem(itemId);
        } else {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
        }
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getCartTotal = () => {
        return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartItemsCount = () => {
        return cart.items.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;