import React, { useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    // Manually add CSS styles to resemble those from react-draft-wysiwyg
    color: '#333', // Text color
    backgroundColor: '#fff', // Background color
    padding: 5, // Padding
    border: '1px solid #ddd', // Border
    borderRadius: 4, // Border radius
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  underline: {
    textDecoration: 'underline',
  },
  // You can add more styles here to match the desired appearance.
});

const applyStyle = (text, style) => (
  <Text style={style}>{text}</Text>
);

const applyStylesToText = (text, inlineStyles) => {
  let result = text;
  if (inlineStyles) {
    if (inlineStyles.bold) {
      result = applyStyle(result, styles.bold);
    }
    if (inlineStyles.italic) {
      result = applyStyle(result, styles.italic);
    }
    if (inlineStyles.underline) {
      result = applyStyle(result, styles.underline);
    }
  }
  return result;
};

const PDFGenerator = ({ content }) => {
  useEffect(()=>{console.log(content)},[content])
  return (
    <PDFViewer width="100%" height="500px">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            {content?.blocks.map((block, index) => (
              <Text key={index}>
                {block.inlineStyleRanges.reduce((text, styleRange) => {
                  return applyStylesToText(text, {
                    [styleRange.style]: true,
                  });
                }, block.text)}
              </Text>
            ))}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PDFGenerator;
