<!--
 Copyright 2022 NTT Corporation.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->

<template>
  <v-layout align-center justify-center>
    <v-flex xs12>
      <div class="wrap">
        <div class="text-wrap">
          <v-text-field
            :mask="mask"
            :label="label"
            :suffix="suffix"
            :id="`numberField${id}_text`"
            :value="internalValue"
            @input="(value) => update(parseInt(value))"
            :readonly="arrowOnly"
            :disabled="disabled"
          ></v-text-field>
        </div>
        <div class="button-wrap">
          <button
            :id="`numberField${id}_increaseButton`"
            class="py-0 my-0 px-0 mx-0"
            @click="increase"
            @blur="onBlur"
            @mousedown="onMouseDown"
            :disabled="disabled"
          >
            <v-icon small>keyboard_arrow_up</v-icon>
          </button>
          <button
            :id="`numberField${id}_decreaseButton`"
            icon
            class="py-0 my-0 px-0 mx-0"
            @click="decrease"
            @blur="onBlur"
            @mousedown="onMouseDown"
            :disabled="disabled"
          >
            <v-icon small>keyboard_arrow_down</v-icon>
          </button>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class NumberField extends Vue {
  @Prop({ type: String, default: "" }) public readonly id!: string;
  @Prop({ type: Number, default: 0 }) public readonly value!: number;
  @Prop({ type: Number, default: 9999 }) public readonly maxValue!: number;
  @Prop({ type: Number, default: 0 }) public readonly minValue!: number;
  @Prop({ type: String }) public readonly label!: string;
  @Prop({ type: String }) public readonly suffix!: string;
  @Prop({ type: Boolean, default: false }) public readonly arrowOnly!: boolean;
  @Prop({ type: Boolean, default: false }) public readonly disabled!: boolean;

  private internalValue = 0;
  private clicking = false;

  private created() {
    this.setValue();
  }

  @Watch("value")
  private setValue() {
    this.internalValue = this.value;
  }

  private get mask() {
    return Array(String(this.maxValue).length).fill("#").join("");
  }

  private onBlur() {
    if (!this.clicking) {
      this.send();
    }
  }
  private onMouseDown() {
    this.clicking = true;
  }

  private increase(): void {
    !this.internalValue ? this.update(1) : this.update(this.internalValue + 1);
    this.clicking = false;
  }

  private decrease(): void {
    !this.internalValue ? this.update(-1) : this.update(this.internalValue - 1);
    this.clicking = false;
  }

  private update(value: number): void {
    let val = value;
    if (this.maxValue !== undefined && val > this.maxValue) {
      val = this.maxValue;
    }
    if (this.minValue !== undefined && val < this.minValue) {
      val = this.minValue;
    }

    this.internalValue = val;
  }

  private send(): void {
    this.$emit("updateNumberFieldValue", {
      id: this.id,
      value: this.internalValue,
    });
  }
}
</script>

<style lang="sass" scoped>
button
  height: 18px !important
  border-radius: 10% !important
  display: block

button:focus
  background-color: #DDD

.wrap
  display: table
  minWidth: 100px

.text-wrap
  width: 100%
  min-width: 50px
  display: table-cell

.button-wrap
  width: 25px
</style>
