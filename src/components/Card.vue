<template>
  <div class="row">
    <div class="col s12">
      <div class="card horizontal d-flex">
        <div class="header d-flex">
          <div class="input-field product-title-input" v-show="edit">
            <select ref="product" v-model="setState.product">
              <option
                v-for="product in orderData.products"
                :value="product"
                :key="product.id"
              >
                {{ product.name }}
              </option>
            </select>
            <label>Выберите товар</label>
          </div>

          <h2 class="title" v-show="!edit">{{ state.product.name }}</h2>

          <div class="status">
            <div class="input-field" v-show="edit">
              <select ref="status" v-model="setState.status">
                <option
                  v-for="status in orderData.statuses"
                  :value="status"
                  :key="status.id"
                >
                  {{ status.name }}
                </option>
              </select>
              <label>Выберите статус</label>
            </div>
            <span v-show="!edit">{{ state.status.name }}</span>
          </div>
        </div>

        <div class="card-stacked">
          <div class="card-content d-flex">
            <div class="card-image">
              <img
                :src="setState.product.photoUrl"
                :alt="setState.product.name"
              />
            </div>
            <table class="card-table">
              <tbody>
                <tr>
                  <td>Цена:</td>
                  <td>${{ setState.product.price }}</td>
                </tr>
                <tr>
                  <td>Количество:</td>
                  <td>
                    <input
                      v-if="edit"
                      type="number"
                      class="validate input-count"
                      v-model.number="setState.count"
                    />
                    <span v-else class="count">{{ state.count }}</span>
                    <span> шт.</span>
                  </td>
                </tr>
                <tr>
                  <td>Сумма</td>
                  <td>${{ setState.product.price * setState.count }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-action right-align">
            <a
              v-for="btn in btns"
              class="waves-effect waves-light btn"
              :class="btn.classList"
              :key="btn.id"
              v-show="btn.visible"
              @click="btn.handler"
            >
              <i class="material-icons left">{{ btn.icon }}</i>
              {{ btn.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      edit: false,
      orderId: this.data.id,
      state: {
        product: this.data.product,
        status: this.data.status,
        count: this.data.count,
      },
      setState: {
        product: this.data.product,
        status: this.data.status,
        count: this.data.count,
      },
      btns: {
        edit: {
          name: "изменить",
          icon: "edit",
          id: "edit",
          classList: "",
          visible: true,
          handler: this.editHandler,
        },
        delete: {
          name: "удалить",
          icon: "delete",
          id: "delete",
          classList: "red darken-1",
          visible: true,
          handler: this.deleteHandler,
        },
        save: {
          name: "сохранить",
          icon: "save",
          id: "save",
          classList: "",
          visible: false,
          handler: this.saveHandler,
        },
        cancel: {
          name: "отмена",
          icon: "cancel",
          id: "cancel",
          classList: "red darken-1",
          visible: false,
          handler: this.cancelHandler,
        },
      },
    };
  },
  props: { data: Object },
  methods: {
    ...mapActions(["setOrderInfo"]),
    ...mapMutations(["deletOrder"]),
    controlBtn(key = "no-edit") {
      if (key === "edit") {
        this.edit = true;
        this.btns.edit.visible = false;
        this.btns.delete.visible = false;
        this.btns.save.visible = true;
        this.btns.cancel.visible = true;
      } else if (key === "no-edit") {
        this.edit = false;
        this.btns.edit.visible = true;
        this.btns.delete.visible = true;
        this.btns.save.visible = false;
        this.btns.cancel.visible = false;
      }
    },

    editHandler() {
      this.controlBtn("edit");
      const selects = this.$el.querySelectorAll("select");
      M.FormSelect.init(selects);
    },

    deleteHandler() {
      const isDel = confirm("Вы уверены, что хотите удалить заказ?");

      // Отправка запроса на сервер
      if (isDel) {
        const response = this.setOrderInfo({
          chunkUrl: `delete/${this.orderId}`,
        });

        // Обновление данных в списке заказов
        response.then((data) => {
          if (data.ok) {
            this.deletOrder(this.orderId);
          }
        });
      }
    },

    saveHandler() {
      if (this.setState.count != "" && this.setState.count > 0) {
        //Отправка данных на сервер
        const response = this.setOrderInfo({
          chunkUrl: "update",
          data: {
            id: this.orderId,
            productId: this.setState.product.id,
            statusId: this.setState.status.id,
            count: this.setState.count,
          },
        });
        // // Обновление данных в карточке
        response.then((data) => {
          if (data.ok) {
            this.state.product = this.setState.product;
            this.state.status = this.setState.status;
            this.state.count = this.setState.count;
          }
        });
      } else {
        alert("Введите коректное количество товара");
        return;
      }

      this.controlBtn("no-edit");
    },

    cancelHandler() {
      this.setState.product = this.state.product;
      this.setState.status = this.state.status;
      this.setState.count = this.state.count;
      this.controlBtn("no-edit");
    },
  },
  computed: {
    ...mapState(["orderData"]),
  },
};
</script>

<style lang="scss" scoped>
.horizontal {
  flex-direction: column;
}

.header {
  justify-content: space-between;
  padding: 24px;
  padding-bottom: 0;
}

.product-title-input {
  margin-top: -6px;
}

.title {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 3em;
}

.status {
  display: flex;
  align-items: center;
  font-size: 1.3em;
  height: 2em;
}
.input-count {
  height: 1.5rem !important;
  width: 30% !important;
}
.card-table tbody tr td:first-child {
  width: 60%;
}

.btn {
  margin-right: 15px;
  &:nth-child(even) {
    margin-right: 0;
  }
}
@media (max-width: 576px) {
  .header {
    .title {
      font-size: 2em;
    }
    flex-direction: column;
    .input-field {
      width: 100%;
    }
  }
  .card-action {
    display: flex;
    .btn {
      padding: 0 10px;
      i {
        margin-right: 5px;
      }
    }
  }
}
</style>
