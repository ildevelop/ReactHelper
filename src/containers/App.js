import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Loading from '../components/Loading';
import Description from '../components/Description/Description';

class App extends Component {
    constructor() {
        super();
        this.state = {
        };
    }

    render() {
        return (
            <div>
                <AppBar
                    showMenuIconButton={false}
                    title="React Helper"
                    // howMenuIconButton={false}
                    className= "StyleMenu"
                    iconElementRight={<h3>Login</h3>}
                    iconStyleRight={{
                        display: 'flex',
                        marginTop: 0,
                        marginRight: 0,
                        alignItems: 'center',
                        color: '#FFFFFF'
                    }}
                />
                {this.props.loading
                && <Loading/>
                // || <MainGrid books={books} onSave={saveBook} onDelete={deleteBook} />
                || <Description/>

                }
            </div>
        );
    }
}

export default App;
