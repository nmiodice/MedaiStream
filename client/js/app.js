/**
 * Nicholas M. Iodice
 * 1/24/2016
 *
 * This file bootstraps the entire application.
 */

var Main = require('./components/Main.react');
var React = require('react');
window.React = React;

React.render(
    <Main />,
    document.getElementById('react')
);
