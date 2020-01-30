import React, {Component} from 'react';

import './item-details.css';
import Spinner from '../spinner';
import ErrorIndicator from "../error-indicator";

const Record = ({item, field, label}) => {
    return (
        <li className="list-group-item">
            <span className="term">{label}</span>
            <span>{item[field]}</span>
        </li>
    );
};

export {
    Record
};

export default class ItemDetails extends Component {

    state = {
        item: null,
        loading: true,
        error: false,
        image: null
    };

    componentDidMount() {
        this.updateItem();
    }

    componentDidUpdate(prevProps) {
        if (this.props.itemId !== prevProps.itemId ||
            this.props.getData !== prevProps.getData ||
            this.props.getImageUrl !== prevProps.getImageUrl) {
            this.onItemLoaded();
            this.updateItem();
        }
    }

    onItemLoaded = () => {
        this.setState({
            loading: true,
            error: false
        });
    };

    updateItem() {
        const {itemId, getData, getImageUrl } = this.props;
        if (!itemId) {
            return;
        }

        getData(itemId)
            .then((item) => {
                this.setState({
                    item,
                    loading: false,
                    image: getImageUrl(item)
                });
            })
            .catch(this.onError);
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        });
    };

    render() {

        if (!this.state.item) {
            return <span>Select a person from a list</span>
        }

        const {item, loading, error, image} = this.state;

        const hasData = !(loading || error);

        const errorMessage = error ? <ErrorIndicator/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = hasData ? <ItemView props={this.props} item={item} image={image} /> : null;

        return (
            <div className="person-details card">
                {errorMessage}
                {spinner}
                {content}
            </div>

        )
    }
}

const ItemView = ({props, item, image}) => {

    const { name } = item;

    return (
        <React.Fragment>

            <img className="person-image"
                 src={image} alt={name}/>

            <div className="card-body">
                <h4>{name}</h4>
                <ul className="list-group list-group-flush">
                    {
                        React.Children.map(props.children, (child) => {
                            return React.cloneElement(child, { item });
                        })
                    }
                </ul>
            </div>

        </React.Fragment>
    );
};
