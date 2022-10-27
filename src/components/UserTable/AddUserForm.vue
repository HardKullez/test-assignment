<template>
  <div class="flex flex-col sm:grid gap-3 md:gap-6 pb-6 px-2 sm:grid-cols-4">
    <div>
      <BaseInput
        v-model.trim="form.name"
        :class="{ 'border-red-500': v$.form.name.$errors.length }"
        type="text"
        area-label="Full name"
        name="name"
        placeholder="Full name"
      />
      <span class="text-red-500 text-xs italic" v-for="error of v$.form.name.$errors" :key="error.$uid">
        {{ error.$message }}
      </span>
    </div>
    <div>
      <BaseInput
        v-model.trim="form.email"
        :class="{ 'border-red-500': v$.form.email.$errors.length }"
        type="email"
        area-label="Email"
        name="email"
        placeholder="Email"
      />
      <span class="text-red-500 text-xs italic" v-for="error of v$.form.email.$errors" :key="error.$uid">
        {{ error.$message }}
      </span>
    </div>
    <div>
      <BaseInput
        v-model.trim="form.phone"
        :class="{ 'border-red-500': v$.form.phone.$errors.length }"
        type="text"
        area-label="Phone number"
        name="phone"
        placeholder="Phone"
      />
      <span class="text-red-500 text-xs italic" v-for="error of v$.form.phone.$errors" :key="error.$uid">
        {{ error.$message }}
      </span>
    </div>
    <BaseButton @click="addRecord" class="h-10">Add</BaseButton>
  </div>
</template>

<script>
import BaseButton from '../base/BaseButton.vue'
import BaseInput from '../base/BaseInput.vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

export default {
  components: {
    BaseInput,
    BaseButton
  },
  emits: ['addRecord'],
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: ''
      }
    }
  },
  validations() {
    return {
      form: {
        name: {
          required: helpers.withMessage('Name is required', required),
          namePatter: helpers.withMessage('Must be a valid full name in latin', helpers.regex(/\w+\s\w+/))
        },
        email: {
          required: helpers.withMessage('Email is required', required),
          email
        },
        phone: {
          required: helpers.withMessage('Phone is required', required),
          phonePattern: helpers.withMessage(
            'Must be a valid BY phone +375 (XX) XXX-XX-XX',
            helpers.regex(/^\+375 \((17|29|33|44)\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/)
          )
        }
      }
    }
  },
  methods: {
    addRecord() {
      this.v$.form.$touch()

      if (this.v$.$error) {
        return
      }

      this.v$.form.$reset()

      this.$emit('addRecord', {
        ...this.form
      })

      this.form = {
        name: '',
        email: '',
        phone: ''
      }
    }
  }
}
</script>
