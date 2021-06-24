<template>
  <div id="app">
    <div class="container">
      <h1>Order list</h1>
    </div>
    <div class="container order-list" v-if="getOrders">
      <Card v-for="order in getOrders" :key="order.id" :data="order" />
    </div>
    <a
      href="#modal"
      class="
        btn-floating btn-large
        waves-effect waves-light
        red
        btn-add-order
        modal-trigger
      "
    >
      <i class="material-icons">add</i>
    </a>

    <ModalForm ref="modalForm" :modal="modal" />
  </div>
</template>

<script>
import Card from "./components/Card.vue";
import ModalForm from "./components/ModalForm.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  name: "App",
  data() {
    return {
      modal: null,
    };
  },
  components: {
    Card,
    ModalForm,
  },
  methods: {
    ...mapActions(["getOrderInfo"]),
  },
  computed: {
    ...mapGetters(["getOrders"]),
    ...mapState(["orderData"]),
  },
  mounted() {
    this.getOrderInfo({ chunkUrl: "orders" });
    this.getOrderInfo({ chunkUrl: "statuses" });
    this.getOrderInfo({ chunkUrl: "products" });
    this.modal = M.Modal.init(this.$refs.modalForm.$el);
  },
  updated() {
    //Иницылизация input Autocomplete
    if (this.orderData.products) {
      const data = {};
      this.orderData.products.forEach((el) => {
        data[el.name] = el.photoUrl;
      });
      M.Autocomplete.init(this.$refs.modalForm.$refs.autocomplete, {
        data,
        limit: 4,
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.btn-add-order {
  position: fixed;
  bottom: 40px;
  right: 40px;
}
</style>
