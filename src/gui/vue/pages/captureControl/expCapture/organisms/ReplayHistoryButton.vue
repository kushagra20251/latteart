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
  <div>
    <v-btn
      v-if="!isReplaying"
      icon
      flat
      large
      color="grey darken-3"
      @click="replayOperations"
      :disabled="disabled || operations.length === 0"
      :title="$store.getters.message('app.replay')"
    >
      <v-icon>play_arrow</v-icon>
    </v-btn>
    <v-btn
      v-if="isReplaying"
      icon
      flat
      large
      color="grey darken-3"
      @click="forceQuitReplay"
      :disabled="disabled"
      :title="$store.getters.message('app.stop-replay')"
    >
      <v-icon>stop</v-icon>
    </v-btn>

    <information-message-dialog
      :opened="informationMessageDialogOpened"
      :title="$store.getters.message('replay.done-title')"
      :message="informationMessage"
      @close="informationMessageDialogOpened = false"
    ></information-message-dialog>
    <error-message-dialog
      :opened="errorDialogOpened"
      :message="errorDialogMessage"
      @close="errorDialogOpened = false"
    ></error-message-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ErrorMessageDialog from "../../../common/ErrorMessageDialog.vue";
import InformationMessageDialog from "../../../common/InformationMessageDialog.vue";

@Component({
  components: {
    "error-message-dialog": ErrorMessageDialog,
    "information-message-dialog": InformationMessageDialog,
  },
})
export default class ReplayHistoryButton extends Vue {
  @Prop({ type: Boolean, default: false }) public readonly disabled!: boolean;
  @Prop({ type: Boolean, default: false })
  public readonly isReplaying!: boolean;

  private errorDialogOpened = false;
  private errorDialogMessage = "";

  private informationMessageDialogOpened = false;
  private informationMessage = "";

  private get operations() {
    return this.$store.getters["operationHistory/getOperations"]();
  }

  private async replayOperations() {
    const successMessage = await this.$store
      .dispatch("captureControl/replayOperations", {
        operations: this.operations,
      })
      .catch((error) => {
        if (error instanceof Error) {
          this.errorDialogOpened = true;
          this.errorDialogMessage = error.message;
        } else {
          throw error;
        }
      });

    if (successMessage) {
      this.informationMessageDialogOpened = true;
      this.informationMessage = this.$store.getters.message(
        `replay.${successMessage}`
      );
    }
  }

  private forceQuitReplay() {
    (async () => {
      await this.$store
        .dispatch("captureControl/forceQuitReplay")
        .catch((error) => {
          console.log(error);
        });
    })();
  }
}
</script>
