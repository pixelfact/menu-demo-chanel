"use client";
import React, { useReducer } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function Navigation ({ menus }) {
    const active = { title: menus.title, id: menus.id };
    const initialState = {
        active: active,
        previous: [],
        previousState: {
            active: active,
            previous: []
        }
    };
    const reducer = (state, action) => {
        switch (action.type) {
        case "forward": {
            const previous = [...state.previous, state.active];
            const previousState = { ...state };
            delete previousState.previousState;
            return {
                active: action.payload,
                previous,
                previousState: previousState
            };
        }
        case "back": {
            const active = [...state.previous][state.previous.length - 1];
            const previous = [...state.previous];
            previous.pop();
            const previousState = { ...state };
            delete previousState.previousState;
            return {
                active,
                previous,
                previousState: previousState
            };
        }
        default:
            throw new Error();
        }
    };
    const [state, dispatch] = useReducer(reducer, initialState);

    const Menu = ({ menu }) => {
        if (!menu) {
            return null;
        }

        return (
            <>
                <motion.ul
                    className='absolute left-0 top-0 bottom-0 w-full m-0 p-0'
                    transition={{ type: "tween" }}
                    animate={
                        menu.id === state.active.id
                            ? "active"
                            : state.previous.find((m) => m.id === menu.id)
                                ? "previous"
                                : "inactive"
                    }
                    initial={
                        menu.id === state.previousState.active.id
                            ? "active"
                            : state.previousState.previous.find((m) => m.id === menu.id)
                                ? "previous"
                                : "inactive"
                    }
                    variants={{
                        active: { x: 0 },
                        inactive: { x: "100%" },
                        previous: { x: "-100%" }
                    }}

                >
                    {menu.items.map(({ text, menu: subMenu }, i) => (
                        <li className='bg-gray-100' key={i}>
                            {!subMenu ? (
                                <a className='flex items-center hover:bg-sky-100 active:bg-sky-200 focus:outline-0 w-full h-[4rem] py-0 px-5 justify-between'>
                                    {text}
                                </a>
                            ) : (
                                <button
                                    className='group flex items-center hover:bg-sky-100 active:bg-sky-200 w-full h-16 py-0 px-5 justify-between'
                                    onClick={() =>
                                        dispatch({
                                            type: "forward",
                                            payload: { title: subMenu.title, id: subMenu.id }
                                        })
                                    }
                                >
                                    {text}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-gray-400 group-hover:stroke-gray-800" >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>

                                </button>
                            )}
                        </li>
                    ))}
                </motion.ul>
                <>
                    {menu.items.map(({ menu }, i) => (
                        <Menu key={i} menu={menu} />
                    ))}
                </>
            </>
        );
    };

    return (
        <div>
            {state.previous.length > 0 && (
                <div className='relative h-16 bg-gray-100'>
                    <button className='group flex items-center focus:outline-0 w-full h-16 py-0 px-5 justify-between' onClick={() => dispatch({ type: "back" })}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} className="w-6 h-6 group-hover:stroke-gray-800 stroke-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>

                    </button>
                </div>
            )}
            <div className='relative h-96 overflow-hidden'>
                <Menu menu={menus} />
            </div>
        </div>
    );
}

const MenuShape = {
    title: PropTypes.string,
    id: PropTypes.string
};

const ItemsShape = {
    text: PropTypes.string.isRequired,
    link: PropTypes.string
};

ItemsShape.menu = PropTypes.shape(MenuShape);
MenuShape.items = PropTypes.arrayOf(PropTypes.shape(ItemsShape));

Navigation.propTypes = {
    menus: PropTypes.shape(MenuShape),
};
