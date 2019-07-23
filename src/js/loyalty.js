import React from 'react';


/**
 * Отвечает за общую логику приложения,
 * обрабатывает ивенты Poster и отображает интерфейс
 */
export default class LoyaltyApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentClient: null,
            currentOrder: null,
        };
    }

    componentDidMount() {
        // Показываем кнопки в интерфейсе Poster
        Poster.interface.showApplicationIconAt({
            order: 'Использовать бонусы',
        });

        // Подписываемся на ивенты Poster
        Poster.on('applicationIconClicked', this.showPopup);
        Poster.on('beforeOrderClose', (data, next) => {
            // Сохранили callback чтобы закрыть заказ
            this.next = next;
            this.showPopup();
        });
    }

    /**
     * Показывает интерфейс в зависимости от места в котором интерфейс вызывают
     * @param data
     */
    showPopup = (data) => {
        this.getCurrentClient()
            .then((info) => {
                if (info.client) {
                    this.setState({ currentOrder: info.order, currentClient: info.client });

                    Poster.interface.popup({ width: 500, height: 300, title: 'Списание бонусов' });
                } else {
                    // Если не нашли клиента, продолжаем поток выполнения в Poster
                    this.next();
                }
            });
    };


    /**
     * Получает текущий заказ и клиента этого заказа
     * @return {PromiseLike<{order, client}>}
     */
    getCurrentClient = () => {
        let activeOrder = null;

        return Poster.orders.getActive()
            .then((data) => {
                if (data.order && data.order.clientId) {
                    activeOrder = data.order;
                    return Poster.clients.get(Number(data.order.clientId));
                }
                return null;
            })
            .then(client => ({ order: activeOrder, client }));
    };

    /**
     * Добавляет клиента к текущему заказу
     * @param order
     * @param newClient
     */
    setOrderClient = (order, newClient) => {
        Poster.clients
            .find({ searchVal: newClient.phone })
            .then((result) => {
                // Если нашли хоть одного клиента, добавляем к заказу
                if (result && result.foundClients && result.foundClients.length) {
                    return result.foundClients[0];
                }

                // Создаем нового клиента
                return Poster.clients.create({
                    client: {
                        client_sex: 1,
                        client_name: newClient.name,
                        phone: newClient.phone,
                        client_groups_id_client: newClient.groupId,
                        bonus: 2000,
                    },
                });
            })
            .then((client) => {
                // Отобразили клиента
                this.setState({ currentOrder: order, currentClient: client });

                // Привязали к заказу
                Poster.orders.setOrderClient(order.id, client.id);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    withdrawBonus = () => {
        const { currentOrder, bonus } = this.state;

        Poster.orders.setOrderBonus(currentOrder.id, parseFloat(bonus));
        Poster.interface.closePopup();

        // Продолжаем стандартный флоу закрытия заказа Poster (показывем окно заказа)
        this.next();
    };

    render() {
        let { bonus, currentClient } = this.state;

        if (!currentClient) {
            return (<div />)
        }

        return (
            <form onSubmit={this.withdrawBonus}>
                <div className="row">
                    <div className="col-xs-12">
                        <p>У {currentClient.firstname} {currentClient.lastname} есть {currentClient.bonus} грн бонусов</p>

                        <label htmlFor="bonus">Списать</label>
                        <input
                            type="text" placeholder="10.99 грн" id="bonus" className="form-control"
                            defaultValue={bonus} onChange={(e) => this.setState({ bonus: e.target.value })}
                        />

                    </div>
                </div>

                <div className="footer">
                    <div className="row">
                        <div className="col-xs-12">
                            <button className="btn btn-lg btn-success" type="submit">
                                Списать бонусы
                            </button>

                            <button
                                className="btn btn-lg btn-default" onClick={Poster.interface.closePopup}
                                style={{ marginRight: 20 }}
                            >
                                Продолжить без списания
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }

}
