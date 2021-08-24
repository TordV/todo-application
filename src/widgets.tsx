import * as React from 'react';
import { ReactNode, ChangeEvent } from 'react'
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import '@fortawesome/fontawesome-free/js/all.js';

// This file originates from the following source code from Ole Eidheim: https://gitlab.com/ntnu-idri1005/react-typescript/-/blob/master/src/widgets.tsx
// His widgets are still present in this document, although many have been modified to fit this application better
// Many self-made widgets have been added in addition to the widgets found in the original source-code

// All widgets containing a className-property uses bootstrap classes. In addition, a few widgets use inline styling in cases where bootstrap classes was not sufficient

/**
 * @description simple container-widget
 * @export
 * @class Container
 * @extends {Component}
 */
export class Container extends Component {
  render() {
    return (
      <div className="container">{this.props.children}</div>
    );
  }
}

/**
 * @description Renders an information card using Bootstrap classes
 * @export
 * @class Card
 * @extends {Component<{ title: ReactNode }>}
 */
export class Card extends Component<{ title: ReactNode }> {
  render() {
    return ( 
      <div className="card bg-dark">
        <div className="card-body">
          <h5 className="card-title">{this.props.title}</h5>
          <div className="card-text">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

/**
 * @description widget that groups children into rows of 3 and 3 cards
 * @export
 * @class CardGroup
 * @extends {Component}
 */
export class CardGroup extends Component {
  render() {
    return <div className="row row-cols-1 row-cols-md-3 g-4">{this.props.children}</div>
  }
}

/**
 * @description widget that creates a special note-card
 * @export
 * @class NoteCard
 * @extends {Component<{
 *   title: ReactNode
 *   color: string
 *   onClick: () => void
 *   to: string
 * }>}
 */
export class NoteCard extends Component<{
  title: ReactNode
  color: string
  onClick: () => void
  to: string
}> {
  render() {
    return (
      <div style={{background: this.props.color}} className="card h-100 text-body">
        <div className="card-body">
          <h5 className="card-title">{this.props.title}</h5>
          <div className="card-text">{this.props.children}</div>
        </div>
        <div className="card-footer">
          <Row>
            <Column>
              <NavLink className="btn btn-light" to={this.props.to}><i className="fa fa-edit" aria-hidden="true"></i></NavLink>
            </Column>
            <Column right>
              <Button.Danger onClick={this.props.onClick}><i className="fa fa-trash" aria-hidden="true"></i></Button.Danger>
            </Column>
          </Row>
        </div>
      </div>
    );
  }
}

/**
 * @description widget for card-footers
 * @export
 * @class CardFooter
 * @extends {Component<{
 * }>}
 */
export class CardFooter extends Component<{
}> {
  render() {
    return (
        <div className="card-footer">
          <div>{this.props.children}</div>
        </div>
    );
  }
}


/**
 * @description widget for weak/muted headers/subheaders
 * @export
 * @class SubHeader
 * @extends {Component}
 */
export class SubHeader extends Component {
  render() {
    return <h6 className="card-subtitle mb-2 text-muted">{this.props.children}</h6>
  }
}

/**
 * @description widget for rows
 * @export
 * @class Row
 * @extends {Component<{ // modified to allow padding
 *   topPadding?: number;
 * }>}
 */
export class Row extends Component <{
  topPadding?: number;
}> {
  render() {
    return <div className={"row" + (this.props.topPadding ? " pt-" + this.props.topPadding : "")}>{this.props.children}</div>;
  }
}

/**
 * @description widget for centered rows
 * @export
 * @class CenteredRow
 * @extends {Component}
 */
export class CenteredRow extends Component {
  render() {
    return <div className="Row d-flex justify-content-center">{this.props.children}</div>
  }
}

/**
 * @description widget for collapsing rows
 * @export
 * @class CollapsingRow
 * @extends {(Component<{
 *   id: number | string;
 * }>)}
 */
export class CollapsingRow extends Component<{
  id: number | string;
}> {
  render() {
    return (
      <div className="collapse" id={"collapse" + this.props.id}>
        {this.props.children}
      </div>
    );
  }
}

/**
 * @description widget for columns
 * @export
 * @class Column
 * @extends {Component<{ 
 *   width?: number; 
 *   right?: boolean; 
 *   none?: boolean 
 * }>}
 */
export class Column extends Component<{ 
  width?: number; 
  right?: boolean; 
  none?: boolean 
}> {
  render() {
    return (
      <div className={'col' + (this.props.width ? '-' + this.props.width : '')}>
        <div className={'float-' + (this.props.right ? 'end' : (this.props.none ? 'none' : 'start'))}>{this.props.children}</div>
      </div>
    );
  }
}

/**
 * @description widget for success-button
 * @class ButtonSuccess
 * @extends {Component<{ 
 *   onClick: () => void
 * }>}
 */
class ButtonSuccess extends Component<{ 
  onClick: () => void
}> {
  render() {
    return (
      <button type="button" className="btn btn-success" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * @description widget for danger-button
 * @class ButtonDanger
 * @extends {Component<{ 
 *   onClick: () => void 
 * }>}
 */
class ButtonDanger extends Component<{ 
  onClick: () => void 
}> {
  render() {
    return (
      <button type="button" className="btn btn-danger" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * @description widget for light-button
 * @class ButtonLight
 * @extends {Component<{ 
 *   onClick: () => void 
 * }>}
 */
class ButtonLight extends Component<{ 
  onClick: () => void 
}> {
  render() {
    return (
      <button type="button" className="btn btn-light" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * @description widget for secondary-button
 * @class ButtonSecondary
 * @extends {Component<{ 
 *   onClick: () => void 
 * }>}
 */
class ButtonSecondary extends Component<{ 
  onClick: () => void 
}> {
  render() {
    return (
      <button type="button" className="btn btn-secondary" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}


/**
 * @description widget for primary-button
 * @class ButtonPrimary
 * @extends {Component<{ 
 *   onClick: () => void 
 * }>}
 */
class ButtonPrimary extends Component<{ 
  onClick: () => void 
}> {
  render() {
    return (
      <button type="button" className="btn btn-primary" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * @description widget for warning-button
 * @class ButtonWarning
 * @extends {Component<{ 
 *   onClick: () => void 
 * }>}
 */
class ButtonWarning extends Component<{ 
  onClick: () => void 
}> {
  render() {
    return (
      <button type="button" className="btn btn-warning" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

/**
 * @description widget for expand-button
 * @class ButtonExpand
 * @extends {(Component<{ 
 *   target: string | number;
 * }>)}
 */
class ButtonExpand extends Component<{ 
  target: string | number;
}> {
  render() {
    return (
      <button type="button" className="btn btn-outline-light dropdown-toggle btn-sm" data-bs-toggle="collapse" data-bs-target={"#collapse" + this.props.target} aria-expanded="false">
        {this.props.children}
      </button>
    );
  }
}

/**
 * @description main button class
 * @export
 * @class Button
 */
export class Button {
  static Success = ButtonSuccess;
  static Danger = ButtonDanger;
  static Light = ButtonLight;
  static Secondary = ButtonSecondary;
  static Primary = ButtonPrimary;
  static Warning = ButtonWarning;
  static Expand = ButtonExpand; 
}

/**
 * @description widget for NavBar-links
 * @class NavBarLink
 * @extends {Component<{ 
 *   to: string 
 * }>}
 */
class NavBarLink extends Component<{ 
  to: string 
}> {
  render() {
    return (
      <NavLink className="nav-link" activeClassName="active" to={this.props.to} exact>
        {this.props.children}
      </NavLink>
    );
  }
}

/**
 * @description widget for the NavBar
 * @export
 * @class NavBar
 * @extends {Component<{ 
 *   brand?: ReactNode 
 *   version: string;
 * }>}
 */
export class NavBar extends Component<{ 
  brand?: ReactNode 
  version: string;
}> {
  static Link = NavBarLink;

  render() {
    return (
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid justify-content-start">
            <div className="navbar-brand">
              <img src="../src/img/ntnu_uten_slagord_neg.png" className="img-fluid" alt="NTNU" width={90} />
            </div>
          </div>
          <div className="container-fluid justify-content-center">
            <div className="navbar-nav">
              {this.props.children}
            </div>
          </div>
          <div className="container-fluid justify-content-end">
            <div className="navbar-nav">
              <div className="nav-item dropdown">
                <a className="nav-link navbar-toggler-icon toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" />
                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="https://gitlab.stud.idi.ntnu.no/gr10/dcst1008_2021_10/-/wikis/home">Documentation</a></li>
                  <li><NavLink className="dropdown-item" exact to="/about">About</NavLink></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><div className="dropdown-item disabled">{this.props.version}</div></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div> 
    );
  }
}

/**
 * @description widget for input-groups
 * @export
 * @class InputGroup
 * @extends {Component<{
 *   margin?: number;
 * }>}
 */
export class InputGroup extends Component<{
  margin?: number;
}> {
  render() {
    return <div className={"input-group " + (this.props.margin ? "mb-" + this.props.margin : "")}>{this.props.children}</div>
  }
}

/**
 * @description widget for form-labels
 * @class FormLabel
 * @extends {Component}
 */
class FormLabel extends Component {
  render() {
    return <label className="col-form-label">{this.props.children}</label>;
  }
}

/**
 * @description widget for form-inputs
 * @class FormInput
 * @extends {(Component<{
 *   type: string;
 *   value: string | number;
 *   onChange: (event: ChangeEvent<HTMLInputElement>) => void;
 *   required?: boolean;
 *   pattern?: string;
 *   maxLength?: number; // added
 *   id: string; // added
 *   name: string; // added
 *   placeholder: string; // added
 *   width?: string; // added
 * }>)}
 */
class FormInput extends Component<{
  type: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  pattern?: string;
  maxLength?: number; // added
  id: string; // added
  name: string; // added
  placeholder: string; // added
  width?: string; // added
}> {
  render() {
    return (
      <div className={"form-floating mb-3 " + (this.props.width ? 'col-' + this.props.width : '')}>
        <input
          className="form-control bg-dark text-white"
          type={this.props.type}
          value={this.props.value}
          onChange={this.props.onChange}
          required={this.props.required}
          pattern={this.props.pattern}
          placeholder={this.props.placeholder}
          maxLength={200}
        />
        <label htmlFor={this.props.id}>{this.props.name}</label>
      </div> 
    );
  }
}

/**
 * @description widget for color-input
 * @class ColorInput
 * @extends {(Component<{
 *   type: string;
 *   value: string | number;
 *   onChange: (event: ChangeEvent<HTMLInputElement>) => void;
 *   title: string;
 *   id?: string;
 *   width?: string;
 * }>)}
 */
class ColorInput extends Component<{
  type: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  title: string;
  id?: string;
  width?: string;
}> {
  render() {
    return (
      <input className={"form-control form-control-color " + (this.props.width ? 'col-' + this.props.width : '')} type="color" value={this.props.value} onChange={this.props.onChange} title="Choose your color" id={this.props.id} />
    );
  }
}

/**
 * @description widget for input with connected button
 * @class InputWithButton
 * @extends {(Component<{
 *   buttonType: string;
 *   value: string | number;
 *   onChange: (event: ChangeEvent<HTMLInputElement>) => void;
 *   onClick: () => void;
 *   placeholder: string;
 * }>)}
 */
class InputWithButton extends Component<{
  buttonType: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  placeholder: string;
}> {
  render() {
    return (
      <div className="input-group mb-3">
        <input type="text" className="form-control bg-dark text-white" placeholder={this.props.placeholder} onChange={this.props.onChange} maxLength={200} />
        <button className={"btn btn-" + this.props.buttonType} type="button" onClick={this.props.onClick}>{this.props.children}</button>
      </div>
    );
  }
}

/**
 * @description widget for input with connected color input
 * @class InputWithColor
 * @extends {(Component<{
 *   value: string | number;
 *   onChange: (event: ChangeEvent<HTMLInputElement>) => void;
 *   onClick: () => void;
 *   placeholder: string;
 * }>)}
 */
class InputWithColor extends Component<{
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  placeholder: string;
}> {
  render() {
    return (
      <div className="input-group mb-3">
        <input type="text" className="form-control bg-dark text-white" placeholder={this.props.placeholder} onChange={this.props.onChange} maxLength={200} />
        <input type="color" className="form-control form-control-color" value={this.props.value} title="Choose your color" />
      </div>
    );
  }
}

/**
 * @description widget for textarea-input
 * @class FormTextArea
 * @extends {(Component<{
 *   rows: number;
 *   value: string | number;
 *   onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
 *   required?: boolean;
 *   maxLength?: number;
 *   id: string;
 *   name: string;
 *   placeholder: string;
 *   width?: string; 
 * }>)}
 */
class FormTextArea extends Component<{
  rows: number;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  maxLength?: number;
  id: string;
  name: string;
  placeholder: string;
  width?: string; 
}> {
  render() {
    return (
      <div className={"form-floating mb-3" + (this.props.width ? ' col-' + this.props.width : '')}>
        <textarea
          rows={this.props.rows}
          className="form-control bg-dark text-white"
          value={this.props.value}
          onChange={this.props.onChange}
          required={this.props.required}
          placeholder={this.props.placeholder}
          maxLength={200}
        />
        <label htmlFor={this.props.id}>{this.props.name}</label>
      </div> 
    );
  }
}

/**
 * @description widget for date-input
 * @class FormDate
 * @extends {(Component<{ 
 *   value: string | number;
 *   onChange: (event: ChangeEvent<HTMLInputElement>) => void;
 *   id: string;
 *   name: string;
 *   placeholder: string;
 *   width?: string; 
 * }>)}
 */
class FormDate extends Component<{ 
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name: string;
  placeholder: string;
  width?: string; 
}> {
  render() {
    return (
      <div className={"form-floating mb-3" + (this.props.width ? ' col-' + this.props.width : '')}>
        <input 
          className="form-control bg-dark text-white" 
          value={this.props.value}
          onChange={this.props.onChange} 
          id={this.props.id}
          name={this.props.name} 
          placeholder={this.props.placeholder} 
          type="text"
        />
        <label htmlFor={this.props.id}>{this.props.name}</label>
      </div>
    );
  }
}

/**
 * @description widget for select-input
 * @class FormSelect
 * @extends {(Component<{ 
 *   value: string | number;
 *   onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
 *   id: string;
 *   name: string;
 *   width?: string;
 * }>)}
 */
class FormSelect extends Component<{ 
  value: string | number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  id: string;
  name: string;
  width?: string;
}> {
  render() {
    return (
      <div className={"form-floating mb-3" + (this.props.width ? ' col-' + this.props.width : '')}>
        <select 
          className="form-select form-select-sm bg-dark text-white" 
          value={this.props.value} 
          onChange={this.props.onChange}>
          {this.props.children}
        </select>
        <label className="col-form-label-sm" htmlFor={this.props.id}>{this.props.name}</label> 
      </div>
    );
  }
}

/**
 * @description main form-class
 * @export
 * @class Form
 */
export class Form {
  static Label = FormLabel;
  static Input = FormInput;
  static Color = ColorInput;
  static InputWithButton = InputWithButton; 
  static InputWithColor = InputWithColor; 
  static TextArea = FormTextArea; 
  static Select = FormSelect; 
  static Date = FormDate; 
}

/**
 * @description widget for Alert-boxes
 * @export
 * @class Alert
 * @extends {Component}
 */
export class Alert extends Component {
  /**
   * @description array for storing alerts
   * @type {{ id: number; text: ReactNode; type: string }[]}
   * @memberof Alert
   */
  alerts: { id: number; text: ReactNode; type: string }[] = [];

  /**
   * @description id of the next alert
   * @type {number}
   * @memberof Alert
   */
  nextId: number = 0;

  render() {
    return (
      <div>
        {this.alerts.map((alert, i) => {
          setTimeout(() => {
            this.alerts.splice(i, 1)
          }, 3000);
          return (
            <div
              key={alert.id}
              className={'alert alert-dismissible alert-' + alert.type}
              role="alert"
              >
              {alert.text}
              <button
                type="button"
                className="btn-close btn-sm"
                onClick={() => this.alerts.splice(i, 1)}
              />
            </div>
          );
      })}
      </div>
    );
  }

  /**
   * @description widget for success-alert
   * @static
   * @param {ReactNode} text
   * @memberof Alert
   */
  static success(text: ReactNode) {
    setTimeout(() => {
      let instance = Alert.instance();
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'success' });
    });
  }

  /**
   * @description widget for info-alert
   * @static
   * @param {ReactNode} text
   * @memberof Alert
   */
  static info(text: ReactNode) {
    setTimeout(() => {
      let instance = Alert.instance();
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'info' });
    });
  }

  /**
   * @description widget for warning-alert
   * @static
   * @param {ReactNode} text
   * @memberof Alert
   */
  static warning(text: ReactNode) {
    setTimeout(() => {
      let instance = Alert.instance();
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'warning' });
    });
  }

  /**
   * @description widget for danger-alerts
   * @static
   * @param {ReactNode} text
   * @memberof Alert
   */
  static danger(text: ReactNode) {
    setTimeout(() => {
      let instance = Alert.instance();
      if (instance) instance.alerts.push({ id: instance.nextId++, text: text, type: 'danger' });
    });
  }
}

/**
 * @description widget for table-element
 * @export
 * @class Table
 * @extends {Component}
 */
export class Table extends Component {
  render() {
    return <table className="table table-dark table-hover align-middle">{this.props.children}</table>;
  }
}

/**
 * @description widget for thead-element
 * @export
 * @class THead
 * @extends {Component}
 */
export class THead extends Component {
  render() {
    return (
      <thead className="table-dark">
        {this.props.children}
      </thead>
    );
  }
}

/**
 * @description widget for tbody-element
 * @export
 * @class TBody
 * @extends {Component}
 */
export class TBody extends Component {
  render() {
    return (
      <tbody>
        {this.props.children}
      </tbody>
    );
  }
}

/**
 * @description widget for tr-element
 * @export
 * @class Tr
 * @extends {Component}
 */
export class Tr extends Component {
  render() {
    return (
      <tr>
        {this.props.children}
      </tr>
    );
  }
}

/**
 * @description widget for collapsing tr-element
 * @export
 * @class CollapsingTr
 * @extends {(Component<{
 *   id: number | string;
 * }>)}
 */
export class CollapsingTr extends Component<{
  id: number | string;
}> {
  render() {
    return (
      <tr className="collapse" id={"collapse" + this.props.id}>
        {this.props.children}
      </tr>
    );
  }
}

/**
 * @description widget for th-element
 * @export
 * @class Th
 * @extends {Component<{
 *   width?: number;
 *   id?: string;
 *   onClick?: () => void;
 *   pointer?: boolean;
 * }>}
 */
export class Th extends Component<{
  width?: number;
  id?: string;
  onClick?: () => void;
  pointer?: boolean;
}> {
  render() {
    return (
      <th className={(this.props.width ? 'col-md-' + this.props.width : "")} id={this.props.id} onClick={this.props.onClick} style={{cursor: (this.props.pointer ? " pointer" : "")}}>
        {this.props.children}
      </th>
    );
  }
}

/**
 * @description widget for td-element
 * @export
 * @class Td
 * @extends {Component<{
 *   colSpan?: number;
 *   align?: string;
 *   width?: number;
 * }>}
 */
export class Td extends Component<{
  colSpan?: number;
  align?: string;
  width?: number;
}> {
  render() {
    return (
      <td className={(this.props.align ? 'align-' + this.props.align : '') + (this.props.width ? ' col-md-' + this.props.width : '')} colSpan={(this.props.colSpan ? this.props.colSpan : 1)}>
        {this.props.children}
      </td>
    );
  }
}

/**
 * @description widget for badges
 * @export
 * @class Badge
 * @extends {Component<{
 *   badge: string;
 * }>}
 */
export class Badge extends Component<{
  badge: string;
}> {
  render() {
    return (
      <span className={"badge bg-" + this.props.badge}>
        {this.props.children}
      </span>
    );
  }
}

/**
 * @description widget for success-badge
 * @export
 * @class BadgeSuccess
 * @extends {Component}
 */
export class BadgeSuccess extends Component {
  render() {
    return (
      <span className="badge bg-success">
        {this.props.children}
      </span>
    );
  }
}

/**
 * @description widget for secondary-badge
 * @export
 * @class BadgeSecondary
 * @extends {Component}
 */
export class BadgeSecondary extends Component {
  render() {
    return (
      <span className="badge bg-secondary">
        {this.props.children}
      </span>
    );
  }
}

/**
 * @description widget for danger-badge
 * @export
 * @class BadgeDanger
 * @extends {Component}
 */
export class BadgeDanger extends Component {
  render() {
    return (
      <span className="badge bg-danger">
        {this.props.children}
      </span>
    );
  }
}

/**
 * @description widget for warning-badge
 * @export
 * @class BadgeWarning
 * @extends {Component}
 */
export class BadgeWarning extends Component {
  render() {
    return (
      <span className="badge bg-warning">
        {this.props.children}
      </span>
    );
  }
}

/**
 * @description widget for primary-badge
 * @export
 * @class BadgePrimary
 * @extends {Component}
 */
export class BadgePrimary extends Component {
  render() {
    return (
      <span className="badge bg-primary">
        {this.props.children}
      </span>
    );
  }
}