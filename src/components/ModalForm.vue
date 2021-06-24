<template>
  <div id="modal" class="modal">
    <form @submit.prevent="createHandler">
      <div class="modal-content">
        <h4>Новый заказ</h4>

        <div class="row">
          <div class="input-field col s12 m9">
            <input
              type="text"
              id="autocomplete-input"
              class="autocomplete"
              @change="changeInput"
              ref="autocomplete"
              autocomplete="off"
            />
            <label for="autocomplete-input">Имя товара</label>
          </div>
          <div class="input-field col s12 m3">
            <input
              type="number"
              id="count"
              class="input-count"
              v-model.number="count"
            />
            <label for="count">Количество</label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="submit" class="waves-effect waves-light btn">
          Создать
        </button>
        <button
          type="button"
          class="modal-close waves-effect waves-light btn red darken-1"
          @click="cancelHandler"
        >
          Отмена
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      productName: "",
      count: "",
    };
  },
  props: ["modal"],
  methods: {
    ...mapActions(["setOrderInfo", "getOrderInfo"]),
    changeInput(e) {
      this.productName = e.target.value;
    },
    createHandler() {
      if (this.productName.trim() !== "") {
        const product = this.orderData.products.find(
          (el) => el.name.trim() === this.productName.trim()
        );
        if (product && this.count > 0) {
          //Отправка данных на сервер
          const response = this.setOrderInfo({
            chunkUrl: "add",
            data: {
              productId: product.id,
              count: this.count,
            },
          });
          // Обновление данных в карточке
          response.then((data) => {
            if (data.ok) {
              console.log("ok");
              this.getOrderInfo({ chunkUrl: "orders" });
              this.getOrderInfo({ chunkUrl: "statuses" });
              this.getOrderInfo({ chunkUrl: "products" });
              this.modal.close();
            } else {
              alert("Введены не валидные данные");
            }
          });
        } else {
          alert("Введены не валидные данные");
        }
      } else {
        alert("Поле не может быть пустым");
      }
    },
    cancelHandler() {
      const labels = this.$el.querySelectorAll("label");
      labels.forEach((el) => {
        el.classList.remove("active");
      });
      this.$refs.autocomplete.value = "";
      this.count = "";
    },
  },
  computed: {
    ...mapState(["orderData"]),
  },
};
</script>

<style lang="scss" scoped>
.modal {
  height: 40%;
  form {
    height: 100%;
    .modal-content {
      height: 80%;
    }
  }
  .modal-footer button {
    margin-right: 6px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
