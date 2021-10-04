const app = new Vue({
    el: '#app',
    data: {
        API: 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses',
        catalogUrl: '/catalogData.json',
        addUrl: '/addToBasket.json',
        delUrl: '/deleteFromBasket.json',
        goodsAll: [],   // все товары
        goods: [],      // отфильтрованные товары
        bascetGoods: [],  // отфильтрованные товары
        orderNum: null,  // актуальный номер заказа 
        orderCounter: null,  // счетчик заказов
        imgCatalog: 'image.jpg',
        isVisibleCart: false,
        isCartNull: true,
    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => console.log(error))
        },
        addProduct(product) {
            this.getJson(`${this.API + this.addUrl}`)
                .then(data => {
                    if (+data.result === 1) {
                        let index = this.bascetGoods.findIndex(item => item.id_product === product.id_product);
                        if (index === -1) {
                            this.bascetGoods.push({ id_product: product.id_product, img: product.img, product_name: product.product_name, price: product.price, quantity: 1 });
                        } else
                            this.bascetGoods[index].quantity++;
                        this.isCartNull = false;
                    };
                    if (this.orderNum === null) this.orderNum = this.orderCounter();
                })
                .catch(error => console.log(error));
        },
        delProduct(product) {
            this.getJson(`${this.API + this.delUrl}`)
                .then(data => {
                    if (+data.result === 1) {
                        let index = this.bascetGoods.findIndex(item => item.id_product === product.id_product);
                        if (this.bascetGoods[index].quantity > 1) {
                            this.bascetGoods[index].quantity--;
                        } else
                            this.bascetGoods.splice(index, 1);
                    };
                    if (this.bascetGoods.length === 0) this.orderNum = null, this.isCartNull = true;
                })
                .catch(error => console.log(error));
        },
        summaryOrder() {
            return this.bascetGoods.reduce((sum, { price, quantity }) => sum += +price * quantity, 0);
        },
        filterProduct(name) {
            if (name === '') this.goods = Array.from(this.goodsAll);
            else {
                let regExp = new RegExp(name.trim() + '+', 'i');
                this.goods = this.goodsAll.filter(({ product_name }) => regExp.test(product_name));
            }
        },
        //  счетчик заказов
        counter() {
            let orderNum = 1;
            return () => orderNum++;
        },
    },
    beforeCreate() { },
    created() {
        this.orderCounter = this.counter();
        this.getJson(`${this.API + this.catalogUrl}`)
            .then(data => {
                for (let el of data) {
                    this.goodsAll.push(el);
                }
                //  вывод полного каталога (фильтр пустой)
                this.filterProduct('');
            });
    },
    beforeMount() { },
    mounted() { },
    beforeUpdate() { },
    updated() { },
    beforeDestroy() { },
    destroyed() { },
});