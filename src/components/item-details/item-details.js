import React, {Component} from 'react';

import './item-details.css';
import SwapiService from "../../services/swapi-service";
import Spinner from '../spinner';
import ErrorIndicator from "../error-indicator";

export default class ItemDetails extends Component {

    swapiService = new SwapiService();

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
        if (this.props.itemId !== prevProps.itemId) {
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
        const content = hasData ? <ItemView item={item} image={image} /> : null;

        return (
            <div className="person-details card">
                {errorMessage}
                {spinner}
                {content}
            </div>

        )
    }
}

const ItemView = ({item, image}) => {

    const { name, gender,
        birthYear, eyeColor
    } = item;

    return (
        <React.Fragment>

            <img className="person-image"
                 src={image}/>

            <div className="card-body">
                <h4>{name}</h4>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <span className="term">Gender</span>
                        <span>{gender}</span>
                    </li>
                    <li className="list-group-item">
                        <span className="term">Birth Year</span>
                        <span>{birthYear}</span>
                    </li>
                    <li className="list-group-item">
                        <span className="term">Eye Color</span>
                        <span>{eyeColor}</span>
                    </li>
                </ul>
            </div>

        </React.Fragment>
    );
};
