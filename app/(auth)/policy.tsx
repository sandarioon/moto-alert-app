import { View, StyleSheet, ScrollView } from "react-native";

import { ThemedText } from "@/components/ThemedText";

export default function PolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header} />
      <ThemedText style={{ textAlign: "left", marginBottom: 10 }} type="title">
        Политика конфиденциальности и защиты информации
      </ThemedText>
      <ThemedText
        style={{ textAlign: "left", marginBottom: 10 }}
        type="default"
      >
        Оставляя данные на сайте, Вы соглашаетесь с Политикой конфиденциальности
        и защиты информации.
      </ThemedText>

      <ThemedText style={{ textAlign: "left", marginBottom: 10 }} type="title">
        Защита данных
      </ThemedText>
      <ThemedText
        style={{ textAlign: "left", marginBottom: 10 }}
        type="default"
      >
        Администрация сайта ios-apps.ru (далее Сайт) не может передать или
        раскрыть информацию, предоставленную пользователем (далее Пользователь)
        при регистрации и использовании функций сайта третьим лицам, кроме
        случаев, описанных законодательством страны, на территории которой
        пользователь ведет свою деятельность.
      </ThemedText>
      <ThemedText style={{ textAlign: "left", marginBottom: 10 }} type="title">
        Получение персональной информации
      </ThemedText>
      <ThemedText
        style={{ textAlign: "left", marginBottom: 10 }}
        type="default"
      >
        Для коммуникации на сайте пользователь обязан внести некоторую
        персональную информацию. Для проверки предоставленных данных, сайт
        оставляет за собой право потребовать доказательства идентичности в
        онлайн или оффлайн режимах.
      </ThemedText>
      <ThemedText style={{ textAlign: "left", marginBottom: 10 }} type="title">
        Использование персональной информации
      </ThemedText>
      <ThemedText
        style={{ textAlign: "left", marginBottom: 10 }}
        type="default"
      >
        Сайт использует личную информацию Пользователя для обслуживания и для
        улучшения качества предоставляемых услуг. Часть персональной информации
        может быть предоставлена банку или платежной системе, в случае, если
        предоставление этой информации обусловлено процедурой перевода средств
        платежной системе, услугами которой Пользователь желает воспользоваться.
        Сайт прилагает все усилия для сбережения в сохранности личных данных
        Пользователя. Личная информация может быть раскрыта в случаях, описанных
        законодательством, либо когда администрация сочтет подобные действия
        необходимыми для соблюдения юридической процедуры, судебного
        распоряжения или легального процесса необходимого для работы
        Пользователя с Сайтом. В других случаях, ни при каких условиях,
        информация, которую Пользователь передает Сайту, не будет раскрыта
        третьим лицам.
      </ThemedText>
      <ThemedText style={{ textAlign: "left", marginBottom: 10 }} type="title">
        Коммуникация
      </ThemedText>
      <ThemedText
        style={{ textAlign: "left", marginBottom: 10 }}
        type="default"
      >
        После того, как Пользователь оставил данные, он получает сообщение,
        подтверждающее его успешную регистрацию. Пользователь имеет право в
        любой момент прекратить получение информационных бюллетеней
        воспользовавшись соответствующим сервисом в Сайте.
      </ThemedText>
      <ThemedText style={{ textAlign: "left", marginBottom: 10 }} type="title">
        Ссылки
      </ThemedText>
      <ThemedText
        style={{ textAlign: "left", marginBottom: 10 }}
        type="default"
      >
        На сайте могут содержаться ссылки на другие сайты. Сайт не несет
        ответственности за содержание, качество и политику безопасности этих
        сайтов. Данное заявление о конфиденциальности относится только к
        информации, размещенной непосредственно на сайте.
      </ThemedText>
      <ThemedText style={{ textAlign: "left", marginBottom: 10 }} type="title">
        Безопасность
      </ThemedText>
      <ThemedText
        style={{ textAlign: "left", marginBottom: 10 }}
        type="default"
      >
        Сайт обеспечивает безопасность учетной записи Пользователя от
        несанкционированного доступа.
      </ThemedText>
      <ThemedText style={{ textAlign: "left", marginBottom: 10 }} type="title">
        Уведомления об изменениях
      </ThemedText>
      <ThemedText
        style={{ textAlign: "left", marginBottom: 10 }}
        type="default"
      >
        Сайт оставляет за собой право вносить изменения в Политику
        конфиденциальности без дополнительных уведомлений. Нововведения вступают
        в силу с момента их опубликования. Пользователи могут отслеживать
        изменения в Политике конфиденциальности самостоятельно.
      </ThemedText>
      <ThemedText style={{ textAlign: "left", marginBottom: 10 }} type="title">
        Для связи
      </ThemedText>
      <ThemedText
        style={{ textAlign: "left", marginBottom: 10 }}
        type="default"
      >
        По всем вопросам, пожалуйста, обращайтесь на почту: info@ios-apps.ru
      </ThemedText>
      <View style={styles.header} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    height: 100,
  },
});
